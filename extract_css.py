import re, io

with io.open('c:/Users/USER/Desktop/NetEnPoche/netenpoche-landing.html', 'r', encoding='utf-8') as f:
    content = f.read()

css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    css = css_match.group(1).replace("'Syne'", "var(--font-syne)").replace("'DM Sans'", "var(--font-dm-sans)")
    
    css += """
.landing-page * { box-sizing: border-box; }
.landing-page { font-family: var(--font-dm-sans), sans-serif; background: var(--navy); color: var(--white); overflow-x: hidden; }

/* HOW IT WORKS */
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
.step-card { background: rgba(255,255,255,0.03); border: 1px solid var(--gray-line); border-radius: 14px; padding: 28px; }
.step-number { font-family: var(--font-syne), sans-serif; font-size: 72px; font-weight: 800; color: rgba(255,255,255,0.05); line-height: 0.8; margin-bottom: 20px; }
.step-title { font-family: var(--font-syne), sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 12px; }
.step-text { font-size: 14px; color: var(--gray-text); line-height: 1.7; }

/* COMP TABLE */
.comp-wrapper { overflow-x: auto; background: rgba(255,255,255,0.03); border: 1px solid var(--gray-line); border-radius: 16px; margin-top: 60px; }
.comp-table { width: 100%; border-collapse: collapse; }
.comp-table th, .comp-table td { padding: 20px; border-bottom: 1px solid var(--gray-line); text-align: left; }
.comp-table th { font-family: var(--font-syne), sans-serif; font-size: 15px; color: var(--gray-text); background: rgba(255,255,255,0.01); }
.comp-table td { font-size: 14px; color: rgba(255,255,255,0.9); }
.comp-me { background: rgba(0,200,117,0.08); color: white; font-weight: bold; border-left: 1px solid rgba(0,200,117,0.2); border-right: 1px solid rgba(0,200,117,0.2); }
th.comp-me { border-top: 1px solid rgba(0,200,117,0.2); color: var(--green); }

/* BLOG */
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 60px; }
.blog-card { background: rgba(255,255,255,0.02); border: 1px solid var(--gray-line); border-radius: 12px; padding: 24px; transition: transform 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
.blog-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); }
.blog-date { font-size: 11px; color: var(--green); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.blog-title { font-family: var(--font-syne), sans-serif; font-size: 18px; font-weight: 700; line-height: 1.4; color: white; margin-bottom: 20px; }
.blog-link { color: var(--gray-text); font-size: 13px; text-decoration: none; font-weight: 500; }
.blog-link:hover { color: white; }
"""
    with io.open('c:/Users/USER/Desktop/NetEnPoche/app/landing.css', 'w', encoding='utf-8') as fw:
        fw.write(css)
    print("CSS Extracted CSS to app/landing.css successfully.")
else:
    print("Could not find <style> block")
