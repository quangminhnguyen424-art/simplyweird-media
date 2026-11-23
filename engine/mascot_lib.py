import json
INK="#1B1B3A"; PINK="#FF5C8A"; BELLY="#FFB3C8"; YEL="#FFD23F"; TEAL="#2EC4B6"; ORG="#FF8A3D"
def huh(expr, label):
    # shared parts
    p = [f'<svg viewBox="0 -60 400 520" width="100%" height="100%" role="img" aria-label="{label}">',
         f'<ellipse cx="200" cy="448" rx="120" ry="12" fill="{INK}" opacity="0.15"></ellipse>',
         f'<path d="M168 392 L162 428" stroke="{INK}" stroke-width="14" stroke-linecap="round"></path>',
         f'<path d="M232 392 L238 428" stroke="{INK}" stroke-width="14" stroke-linecap="round"></path>',
         f'<ellipse cx="152" cy="432" rx="24" ry="12" fill="{INK}"></ellipse>',
         f'<ellipse cx="248" cy="432" rx="24" ry="12" fill="{INK}"></ellipse>']
    # arms by pose
    arms = {"curious": ("M66 290 Q26 300 30 344", "M334 290 Q374 300 370 344"),
            "shocked": ("M70 260 Q20 220 24 170", "M330 260 Q380 220 376 170"),
            "laughing": ("M70 300 Q110 360 150 352", "M330 300 Q290 360 250 352"),
            "thinking": ("M70 296 Q90 380 166 356", "M334 290 Q374 300 370 344"),
            "explaining": ("M66 290 Q26 300 30 344", "M334 252 Q384 196 372 128")}[expr]
    hands = {"curious": ((30, 346), (370, 346)), "shocked": ((24, 166), (376, 166)), "laughing": ((152, 352), (248, 352)),
             "thinking": ((170, 354), (370, 346)), "explaining": ((30, 346), (372, 124))}[expr]
    for d in arms: p.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="14" stroke-linecap="round"></path>')
    # antenna shaped like a question mark; the head is its dot
    tilt = {"curious": 8, "shocked": -4, "laughing": 14, "thinking": -14, "explaining": 6}[expr]
    p.append(f'<g transform="rotate({tilt} 200 120)"><path d="M200 116 L200 82 Q200 58 226 48 Q258 36 254 4 Q248 -30 212 -30 Q180 -28 172 0" fill="none" stroke="{INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="172" cy="2" r="12" fill="{YEL}" stroke="{INK}" stroke-width="6"></circle></g>')
    # body
    p.append(f'<path d="M200 112 C300 112 352 182 350 262 C348 344 286 400 200 400 C114 400 52 344 50 262 C48 182 100 112 200 112 Z" fill="{PINK}" stroke="{INK}" stroke-width="12" stroke-linejoin="round"></path>')
    p.append(f'<ellipse cx="200" cy="330" rx="96" ry="56" fill="{BELLY}"></ellipse>')
    p.append(f'<ellipse cx="104" cy="292" rx="22" ry="13" fill="{ORG}" opacity="0.7"></ellipse><ellipse cx="300" cy="288" rx="22" ry="13" fill="{ORG}" opacity="0.7"></ellipse>')
    for (hx, hy) in hands: p.append(f'<circle cx="{hx}" cy="{hy}" r="17" fill="{PINK}" stroke="{INK}" stroke-width="9"></circle>')
    if expr == "explaining": p.append(f'<path d="M372 108 L372 82" stroke="{INK}" stroke-width="10" stroke-linecap="round"></path>')
    # eyes: small left, big right (signature)
    if expr == "laughing":
        p.append(f'<path d="M122 236 Q148 206 176 236" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"></path>')
        p.append(f'<path d="M216 230 Q258 186 302 230" fill="none" stroke="{INK}" stroke-width="12" stroke-linecap="round"></path>')
    else:
        p.append(f'<circle cx="148" cy="234" r="32" fill="#ffffff" stroke="{INK}" stroke-width="10"></circle>')
        p.append(f'<circle cx="258" cy="226" r="50" fill="#ffffff" stroke="{INK}" stroke-width="10"></circle>')
        look = {"curious": (10, -8), "shocked": (0, 0), "thinking": (-10, -12), "explaining": (4, 4)}[expr]
        pr = (9, 12) if expr == "shocked" else (15, 22)
        p.append(f'<circle cx="{148+look[0]}" cy="{234+look[1]}" r="{pr[0]}" fill="{INK}"></circle>')
        p.append(f'<circle cx="{258+look[0]*1.6:.0f}" cy="{226+look[1]*1.6:.0f}" r="{pr[1]}" fill="{INK}"></circle>')
        p.append(f'<circle cx="{143+look[0]}" cy="{229+look[1]}" r="4" fill="#ffffff"></circle><circle cx="{250+look[0]*1.6:.0f}" cy="{218+look[1]*1.6:.0f}" r="6" fill="#ffffff"></circle>')
    # brows
    brows = {"curious": ("M120 192 Q148 188 176 196", "M222 162 Q262 138 304 158"),
             "shocked": ("M120 180 Q148 166 176 180", "M222 150 Q262 126 304 150"),
             "laughing": ("M120 196 Q148 186 176 196", "M222 172 Q262 160 304 172"),
             "thinking": ("M120 196 Q148 204 176 192", "M222 166 Q262 156 304 172"),
             "explaining": ("M120 192 Q148 184 176 192", "M222 164 Q262 148 304 164")}[expr]
    for d in brows: p.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="11" stroke-linecap="round"></path>')
    # mouth
    mouth = {"curious": f'<path d="M164 304 Q204 324 238 296" fill="none" stroke="{INK}" stroke-width="11" stroke-linecap="round"></path>',
             "shocked": f'<ellipse cx="200" cy="314" rx="26" ry="34" fill="#7A1E2C" stroke="{INK}" stroke-width="9"></ellipse>',
             "laughing": f'<path d="M140 286 Q200 372 262 286 Z" fill="#7A1E2C" stroke="{INK}" stroke-width="10" stroke-linejoin="round"></path><path d="M172 322 Q202 350 232 322 Q202 330 172 322 Z" fill="#FF7A9C"></path>',
             "thinking": f'<path d="M168 310 Q184 300 200 310 Q216 320 232 308" fill="none" stroke="{INK}" stroke-width="11" stroke-linecap="round"></path>',
             "explaining": f'<path d="M164 296 Q200 344 240 294 Q200 310 164 296 Z" fill="#7A1E2C" stroke="{INK}" stroke-width="9" stroke-linejoin="round"></path>'}[expr]
    p.append(mouth)
    if expr == "shocked":
        p.append(f'<path d="M330 140 Q336 160 326 172 Q316 160 330 140 Z" fill="#9ADCF5" stroke="{INK}" stroke-width="5"></path>')
    if expr == "thinking":
        p.append(f'<circle cx="330" cy="120" r="10" fill="#ffffff" stroke="{INK}" stroke-width="5"></circle><circle cx="356" cy="88" r="15" fill="#ffffff" stroke="{INK}" stroke-width="5"></circle>')
    p.append('</svg>')
    return "\n".join(p)
