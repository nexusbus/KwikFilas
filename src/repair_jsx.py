import os

path = r'c:\Users\jossa\Downloads\KwikFilas-main\src\App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Repair the button and JSX
fixed_lines = []
skip = False
for i, line in enumerate(lines):
    if '            </motion.div>' in line and i > 900 and i < 1000:
        fixed_lines.append('            <button onClick={() => setShowAbandonModal(true)} disabled={loading} className="w-full py-4 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">Abandonar Fila</button>\n')
        fixed_lines.append(line)
    else:
        fixed_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(fixed_lines)

print("Repair complete.")
