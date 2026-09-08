"""Execute every original standard-library lesson example in an isolated process."""
import json
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
count = 0
for path in sorted((root / 'lib' / 'curriculum').glob('*.json')):
    for lesson in json.loads(path.read_text(encoding='utf-8')):
        result = subprocess.run([sys.executable, '-I', '-c', lesson['code']], capture_output=True, text=True, timeout=10)
        if result.returncode:
            raise AssertionError(f"{lesson['id']}: {result.stderr}")
        if not result.stdout.strip():
            raise AssertionError(f"{lesson['id']}: no example output")
        count += 1
print(f'{count} Python lesson examples executed successfully.')
