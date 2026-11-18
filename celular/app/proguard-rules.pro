# El tema oscuro llama a EcoNative.setDark desde la web: no renombrar ni quitar ese metodo.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
