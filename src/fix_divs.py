import os

path = r'c:\Users\jossa\Downloads\KwikFilas-main\src\App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Search for the specific export default function App to find the end of ClientView
for i, line in enumerate(lines):
    if 'export default function App()' in line:
        # Check the preceding lines for the closing of ClientView
        if i > 2 and '</div>' in lines[i-5] and '</div>' not in lines[i-4]:
             # Insert the missing div
             lines.insert(i-4, '       </div>\n')
             break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fix applied.")
