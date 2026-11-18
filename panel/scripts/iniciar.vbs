Option Explicit
Dim sh, fso, root, url, i, browser, cands, c
Set sh  = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))
sh.CurrentDirectory = root
url = "http://localhost:4173/"

' Si todavia no se instalo, correr el instalador
If Not fso.FileExists(root & "\dist\index.html") Then
  sh.Run """" & root & "\INSTALAR.bat""", 1, False
  WScript.Quit
End If

Function ServerUp(u)
  Dim http
  ServerUp = False
  On Error Resume Next
  Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  http.setTimeouts 1000, 1000, 1000, 1000
  http.open "GET", u, False
  http.send
  If Err.Number = 0 Then
    If http.status = 200 Then ServerUp = True
  End If
  On Error GoTo 0
End Function

' Encender el servidor en segundo plano (sin ventana negra)
If Not ServerUp(url) Then
  sh.Run "cmd /c npm run preview -- --port 4173 --strictPort", 0, False
  For i = 1 To 60
    WScript.Sleep 500
    If ServerUp(url) Then Exit For
  Next
End If

' Buscar Chrome o Edge para abrir como aplicacion (sin barra de direcciones)
cands = Array( _
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe", _
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe", _
  "%LocalAppData%\Google\Chrome\Application\chrome.exe", _
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe", _
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe")
browser = ""
For Each c In cands
  If browser = "" Then
    If fso.FileExists(sh.ExpandEnvironmentStrings(c)) Then browser = sh.ExpandEnvironmentStrings(c)
  End If
Next

If browser <> "" Then
  sh.Run """" & browser & """ --app=" & url, 1, False
Else
  sh.Run url, 1, False
End If
