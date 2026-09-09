"""Run the actual downloadable scikit-learn examples in isolated processes."""
import json,subprocess,sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
examples=json.loads((root/'lib/practical-examples.json').read_text(encoding='utf-8'))
for example in examples:
    code=(root/'public/examples'/f"{example['id']}.py").read_text(encoding='utf-8')
    assert code==example['code'],example['id']+' download differs from displayed code'
    result=subprocess.run([sys.executable,'-I','-c',code],capture_output=True,text=True,timeout=90)
    assert result.returncode==0,example['id']+': '+result.stderr
    assert result.stdout.strip(),example['id']+' produced no output'
print(f'{len(examples)} complete scikit-learn examples executed successfully.')
