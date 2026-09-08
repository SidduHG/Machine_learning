"""Run the delivered notebook code and verify generated notebooks match source."""
import json
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
projects = json.loads((root/'lib/projects.json').read_text(encoding='utf-8'))
for project in projects:
    notebook = json.loads((root/'public/notebooks'/f"{project['id']}.ipynb").read_text(encoding='utf-8'))
    code = ''.join(cell_source for cell in notebook['cells'] if cell['cell_type']=='code' for cell_source in cell['source'])
    assert code == project['code'], f"Stale notebook: {project['id']}"
    result = subprocess.run([sys.executable,'-I','-c',code],capture_output=True,text=True,timeout=180)
    if result.returncode:
        raise AssertionError(f"{project['id']}: {result.stderr}")
    print(project['id'], '— executed successfully')
print(f'{len(projects)} project notebooks verified.')
