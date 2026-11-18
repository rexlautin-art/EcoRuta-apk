/* CAPA DE PRESENTACION (receptora): guardar lo recibido en el telefono. */
(function () {
  'use strict';
  window.AppStorage = {
    // Navegador: descarga normal. En la APK, el WebView actual no maneja descargas por si solo
    // (hace falta un metodo nativo de guardado: ver LEEME del puente).
    save: function (blob, name) {
      var a = document.createElement('a');
      var url = URL.createObjectURL(blob);
      a.href = url; a.download = name || 'archivo';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
    }
  };
})();
