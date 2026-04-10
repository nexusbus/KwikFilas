import os

file_path = r'c:\Users\jossa\Downloads\KwikFilas-main\src\App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Telemovel column
old_header = '<th className="px-6 py-4">Telemóvel</th>'
new_header = '<th className="px-6 py-4">Cliente</th>'
content = content.replace(old_header, new_header)

# Replace Ultima Atividade to match
old_header2 = '<th className="px-6 py-4">Última Atividade</th>'
new_header2 = '<th className="px-6 py-4">Frequência</th>\n                          <th className="px-6 py-4">Última Atividade</th>'
content = content.replace(old_header2, new_header2)

# Replace the row content
old_row = """                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3451D1] text-[10px] font-bold">{c.phone.slice(-2)}</div>
                                   <span className="font-bold text-[#0F172A]">{c.phone}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                {new Date(c.served_at).toLocaleDateString()} às {new Date(c.served_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <span className="badge badge-active">Verificado</span>
                             </td>"""

new_row = """                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3451D1] text-xs font-bold">
                                     {(c.name || 'C').charAt(0).toUpperCase()}
                                   </div>
                                   <div className="flex flex-col">
                                     <span className="font-bold text-[#0F172A]">{c.name || 'Cliente'}</span>
                                     <span className="text-[10px] text-slate-400 font-medium">{c.phone}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-xs font-bold text-[#3451D1] bg-blue-50 px-2 py-1 rounded-md">{c.visit_count} Visitas</span>
                             </td>
                             <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                {new Date(c.last_visit).toLocaleDateString()} às {new Date(c.last_visit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <span className="badge badge-active">Ativo</span>
                             </td>"""

# Using a simpler match for the row content to avoid indentation issues
import re
pattern = re.compile(re.escape(old_row), re.MULTILINE)
content = pattern.sub(new_row, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
