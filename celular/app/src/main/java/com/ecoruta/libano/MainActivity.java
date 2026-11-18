package com.ecoruta.libano;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.res.Configuration;
import android.window.OnBackInvokedDispatcher;
import android.view.WindowManager;
import android.webkit.JsResult;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.Gravity;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Pantalla unica: un WebView que carga la web de EcoRuta empaquetada en assets/web. */
public class MainActivity extends Activity {

    interface PermissionCallback {
        void result(boolean granted);
    }

    private static final String START_URL = "file:///android_asset/web/index.html";
    private static final int REQ_LOCATION = 1001;
    private static final int REQ_NOTIFICATIONS = 1002;
    private static final int BG_LIGHT = 0xFFF6F7F5;
    private static final int BG_DARK = 0xFF101512;
    /** Version minima de Chrome/WebView: por debajo el JavaScript de la app no se entiende y la pantalla queda en blanco. */
    private static final int MIN_WEBVIEW = 80;
    /** Cierra la ventana emergente abierta (ayuda, SOS, formularios), si hay una. Devuelve 1 si cerro algo. */
    private static final String CLOSE_DIALOG_JS =
            "(function(){var b=document.querySelector('.overlay [aria-label=\"Cerrar\"]');if(b){b.click();return 1}return 0})()";

    private FrameLayout root;
    private WebView webView;
    private NativeBridge bridge;
    private final List<PermissionCallback> locationWaiters = new ArrayList<>();
    private boolean locationRequestInFlight = false;
    private boolean notificationsAsked = false;
    private long lastBackMs = 0L;
    /** Tema oscuro vigente (lo fija la web con EcoNative.setDark; al inicio se usa el del sistema). */
    private boolean dark = false;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        dark = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                == Configuration.UI_MODE_NIGHT_YES;
        root = new FrameLayout(this);
        root.setBackgroundColor(dark ? BG_DARK : BG_LIGHT);
        setContentView(root);

        // Deja la web fuera de las barras del sistema y por encima del teclado.
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets bars = insets.getInsets(
                    WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout()
                            | WindowInsetsCompat.Type.ime());
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(debuggable);

        webView = new WebView(this);
        webView.setBackgroundColor(dark ? BG_DARK : BG_LIGHT);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setGeolocationEnabled(true);
        s.setAllowFileAccess(true);                 // necesario para cargar file:///android_asset
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);

        webView.setWebViewClient(new WebViewClient() {
            /** Mapa sin internet: si la tesela esta guardada dentro de la app (assets/tiles), se entrega desde alli. */
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (!"GET".equalsIgnoreCase(request.getMethod())) return null;
                String path = TileAssets.assetPathFor(request.getUrl().toString());
                if (path == null) return null;
                try {
                    InputStream in = getAssets().open(path);
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Cache-Control", "max-age=86400");
                    return new WebResourceResponse("image/png", null, 200, "OK", headers, in);
                } catch (IOException e) {
                    return null; // esa tesela no esta en la app: se pide por internet como siempre
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme() == null ? "" : uri.getScheme();
                if (scheme.equals("file")) {
                    // Solo permitimos navegar dentro de nuestros propios assets.
                    String path = uri.getPath() == null ? "" : uri.getPath();
                    return !path.startsWith("/android_asset/");
                }
                // Enlaces externos (mapas, telefono, correo...) se abren fuera de la app.
                if (scheme.equals("http") || scheme.equals("https") || scheme.equals("geo")
                        || scheme.equals("tel") || scheme.equals("mailto") || scheme.equals("sms")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (Exception ignored) {
                        // No hay app que maneje el enlace.
                    }
                }
                return true;
            }
        });

        // Respaldo: si la web usara el GPS del WebView en vez del puente nativo.
        webView.setWebChromeClient(new WebChromeClient() {
            /** alert() de la web: sin esto Android lo ignora en silencio. */
            @Override
            public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
                return showJsDialog(message, false, result);
            }

            /** confirm() de la web (finalizar turno, borrar datos...): sin esto devolvia "cancelar" siempre. */
            @Override
            public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
                return showJsDialog(message, true, result);
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(final String origin,
                                                           final GeolocationPermissions.Callback callback) {
                if (LocationHub.hasPermission(MainActivity.this)) {
                    callback.invoke(origin, true, false);
                    return;
                }
                askLocationPermission(new PermissionCallback() {
                    @Override
                    public void result(boolean granted) {
                        callback.invoke(origin, granted, false);
                    }
                });
            }
        });

        bridge = new NativeBridge(this, webView);
        webView.addJavascriptInterface(bridge, "EcoNative");

        int major = chromeMajor(s.getUserAgentString());
        if (major > 0 && major < MIN_WEBVIEW) {
            root.addView(buildOutdatedView(major));
        } else {
            startWebApp(savedInstanceState);
        }
        applyTheme(dark);

        // Android 13+: el boton atras se maneja con OnBackInvokedCallback (onBackPressed deja de llamarse
        // en versiones nuevas). En Android 12 o menos sigue funcionando onBackPressed().
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::onBackRequested);
        }
    }

    // ---------- Puente con la web: dialogos, tema y pantalla encendida ----------

    private boolean showJsDialog(String message, final boolean withCancel, final JsResult result) {
        if (isFinishing() || isDestroyed()) {
            result.cancel();
            return true;
        }
        AlertDialog.Builder b = new AlertDialog.Builder(this,
                dark ? android.R.style.Theme_Material_Dialog_Alert
                     : android.R.style.Theme_Material_Light_Dialog_Alert);
        b.setTitle(R.string.app_name);
        b.setMessage(message);
        b.setCancelable(withCancel);
        b.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface d, int which) {
                result.confirm();
            }
        });
        if (withCancel) {
            b.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface d, int which) {
                    result.cancel();
                }
            });
            b.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface d) {
                    result.cancel();
                }
            });
        }
        b.show();
        return true;
    }

    /** Colorea fondo y barras del sistema segun el tema de la web (claro u oscuro). */
    void applyTheme(boolean isDark) {
        dark = isDark;
        int color = isDark ? BG_DARK : BG_LIGHT;
        if (root != null) root.setBackgroundColor(color);
        if (webView != null) webView.setBackgroundColor(color);
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.setAppearanceLightStatusBars(!isDark);
        c.setAppearanceLightNavigationBars(!isDark);
    }

    /** Mantiene la pantalla encendida mientras el conductor tiene una ruta activa. */
    void keepScreenOn(boolean on) {
        if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    private void startWebApp(Bundle saved) {
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        if (saved == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(saved);
        }
    }

    // ---------- WebView antiguo ----------

    private static int chromeMajor(String userAgent) {
        if (userAgent == null) return 0;
        Matcher m = Pattern.compile("Chrome/(\\d+)").matcher(userAgent);
        if (!m.find()) return 0;
        try {
            return Integer.parseInt(m.group(1));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private View buildOutdatedView(int major) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        box.setPadding(dp(24), dp(24), dp(24), dp(24));

        TextView title = new TextView(this);
        title.setText(R.string.webview_title);
        title.setTextSize(20);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setTextColor(0xFF1F2A24);
        title.setGravity(Gravity.CENTER);
        box.addView(title);

        TextView message = new TextView(this);
        message.setText(getString(R.string.webview_message, major, MIN_WEBVIEW));
        message.setTextSize(16);
        message.setTextColor(0xFF4A5750);
        message.setGravity(Gravity.CENTER);
        message.setPadding(0, dp(16), 0, dp(24));
        box.addView(message);

        Button update = new Button(this);
        update.setText(R.string.webview_update);
        update.setOnClickListener(v -> openWebViewInStore());
        box.addView(update);

        Button anyway = new Button(this);
        anyway.setText(R.string.webview_continue);
        anyway.setOnClickListener(v -> {
            root.removeAllViews();
            startWebApp(null);
        });
        box.addView(anyway);
        return box;
    }

    private void openWebViewInStore() {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.google.android.webview")));
        } catch (ActivityNotFoundException e) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.webview")));
            } catch (ActivityNotFoundException ignored) {
                // sin Play Store ni navegador
            }
        }
    }

    // ---------- Permisos ----------

    void askLocationPermission(PermissionCallback callback) {
        if (LocationHub.hasPermission(this)) {
            callback.result(true);
            return;
        }
        locationWaiters.add(callback);
        if (!locationRequestInFlight) {
            locationRequestInFlight = true;
            requestPermissions(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_LOCATION);
        }
    }

    /** Pide (una sola vez) el permiso para mostrar la notificacion del seguimiento en Android 13 o superior. */
    void askNotificationPermissionOnce() {
        if (Build.VERSION.SDK_INT >= 33 && !notificationsAsked
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            notificationsAsked = true;
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIFICATIONS);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_LOCATION) {
            boolean granted = false;
            for (int r : grantResults) {
                if (r == PackageManager.PERMISSION_GRANTED) granted = true;
            }
            locationRequestInFlight = false;
            List<PermissionCallback> waiters = new ArrayList<>(locationWaiters);
            locationWaiters.clear();
            for (PermissionCallback cb : waiters) cb.result(granted);
        }
    }

    // ---------- Boton "atras" ----------

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        onBackRequested(); // Android 12 o menos
    }

    private void onBackRequested() {
        // 1) Si hay una ventana emergente abierta, se cierra; 2) si no, se retrocede o se pide confirmar la salida.
        webView.evaluateJavascript(CLOSE_DIALOG_JS, value -> handleBack(value));
    }

    private void handleBack(String closedDialog) {
        if ("1".equals(closedDialog)) return;
        if (webView.canGoBack()) {
            webView.goBack();
            return;
        }
        if (TrackingService.isRunning()) {
            moveTaskToBack(true); // el conductor sigue compartiendo la ubicacion: no se cierra la app
            return;
        }
        long now = SystemClock.uptimeMillis();
        if (now - lastBackMs < 2000L) {
            finish();
            return;
        }
        lastBackMs = now;
        Toast.makeText(this, R.string.back_hint, Toast.LENGTH_SHORT).show();
    }

    // ---------- Ciclo de vida ----------

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        if (bridge != null) bridge.destroy();
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }
}
