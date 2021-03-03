import shutil
import os

with open('gmbot-proxy-extension/gmbot_proxy.js') as f:
    proxy_script = f.read()

with open('gmbot-proxy-extension/socket.io.js') as f:
    socket_io = f.read()

with open('gmbot-proxy-extension/lodash-custom.js') as f:
    lodash = f.read()

if not os.path.exists('extension-build/'):
    os.makedirs('extension-build/')

with open('extension-build/gmbot_proxy.js', 'w') as f:
    f.write("\n\n// ----------------- SOCKET.IO CLIENT BELOW ----------------\n\n")
    f.write(socket_io)
    f.write("\n\n// ---------------------- LODASH BELOW ---------------------\n\n")
    f.write(lodash)
    f.write("\n\n// ---------------- GMBOT PROXY SCRIPT BELOW ---------------\n\n")
    f.write(proxy_script)

shutil.copy2('gmbot-proxy-extension/manifest.json', 'extension-build/manifest.json')
