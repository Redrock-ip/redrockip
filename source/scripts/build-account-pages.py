"""Build registration and password recovery routes with the shared login shell."""
import argparse
import re
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parent.parent)
root = parser.parse_args().root
dist = root/'dist'
login = dist/'login.html'
shell = login.read_text(encoding='utf-8')
for route in ('forgot-password','register'):
    shell = shell.replace(f'href="https://redrock-ip.com/{route}" target="_blank" rel="noopener"',f'href="/{route}"')
login.write_text(shell,encoding='utf-8')

story = re.search(r'<main class="auth-main">\s*(<section class="auth-story".*?</section>)',shell,re.S)
assert story, 'Missing shared sign-in story'

def build(route, title, description, heading, preview_script, script):
    panel = (root/'account-templates'/f'{route}.html').read_text(encoding='utf-8').strip()
    main = '<main class="auth-main">' + story.group(1) + panel + '</main>'
    page, count = re.subn(r'<main class="auth-main".*?</main>',lambda _:main,shell,count=1,flags=re.S)
    assert count == 1, 'Missing account page shell'
    page = page.replace('<title>登录 · REDROCK</title>',f'<title>{title} · REDROCK</title>')
    page = re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{description}">',page,count=1)
    page = page.replace('href="#login-form">跳转到登录表单',f'href="#{heading}">跳转到{title}')
    scripts = ('login.js','account-challenge.js',preview_script,script)
    page = page.replace('<script src="login.js"></script>',''.join(f'<script src="{path}"></script>' for path in scripts))
    (dist/f'{route}.html').write_text(page,encoding='utf-8')
    print(f'Built {route}.html')

build('forgot-password','找回密码','通过邮箱验证找回 REDROCK 账户密码。',
      'recovery-title','recovery-preview.js','password-recovery.js')
build('register','注册账户','验证邮箱并创建 REDROCK 账户。',
      'register-title','registration-preview.js','registration.js')
