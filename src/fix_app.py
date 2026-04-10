import os

path = r'c:\Users\jossa\Downloads\KwikFilas-main\src\App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix handleManualJoin corruption
corrupt_join = 'body: JSON.     if (res.ok) { setManualPhone(""); refresh(); notify("Senha Manual Gerada"); }'
clean_join = 'body: JSON.stringify({ phone: manualPhone, estCode: est.code, name: autoName })\n      });\n\n      if (res.ok) { setManualPhone(""); refresh(); notify("Senha Manual Gerada"); }'

content = content.replace(corrupt_join, clean_join)

# Fix handlePrintQR duplicate/corruption
corrupt_print_end = ');</script>\n      </body></html>\n    `);\n    printWindow.document.close();\n  };'
content = content.replace(corrupt_print_end, '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Repair complete.")
