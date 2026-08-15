// 草薙宁宁主题 · Nene Theme —— 浏览器半（客户端插件）
// 编译后经 tsdown 打包为 lib/client.js，由 dsh.client 声明发现并加载。
import { createElement, useEffect, useState } from 'react'
import tachieImg from '../assets/1.webp?inline'
import dayImg from '../assets/2.webp?inline'
import nightImg from '../assets/3.webp?inline'

export default {
  apply(ctx: any) {
    const slots = ctx.get('slots')
    const theme = ctx.get('theme')
    if (slots === undefined) return

    function injectCss(css: string): () => void {
      const tag = document.createElement('style')
      tag.setAttribute('data-plugin-css', 'dsh-client-ui-nene')
      tag.textContent = css
      document.head.appendChild(tag)
      return () => {
        tag.remove()
      }
    }

    // ---------- 宁宁台词（粉丝向二次创作，上日文下中文） ----------
    const LINES = {
      greet: [
        { jp: 'あっ、おかえり……！今日も一緒に、がんばろうね。', cn: '啊，欢迎回来……！今天也一起加油吧。' },
        { jp: 'こ、こんにちは……。草薙寧々、です……。', cn: '你、你好……。我是草薙宁宁……。' },
        { jp: '来てくれて、うれしい……。えっと、よろしくね。', cn: '你能来，我很开心……。那个，请多指教哦。' },
        { jp: 'ふぇっ……！？あ、来てくれたんだ。……えへへ。', cn: '欸……！？啊，你来了呀。……嘿嘿。' },
        { jp: '……今日は、どんな歌を歌おうかな。', cn: '……今天，唱什么歌好呢。' }
      ],
      idle: [
        { jp: 'あの……何か手伝えること、ある……？', cn: '那个……有什么我能帮上忙的吗……？' },
        { jp: 'ふぅ……ちょっと、一休みしよっか。', cn: '呼……稍微休息一下吧。' },
        { jp: 'いつでも呼んでね。……待ってるから。', cn: '随时都可以叫我哦。……我会等着的。' },
        { jp: '……今日も、がんばろうね。', cn: '……今天也要加油哦。' },
        { jp: 'ゲーム、ちょっとだけ……してていい？', cn: '游戏，就玩一小会儿……可以吗？' },
        { jp: 'えへへ……なんでもないの。', cn: '嘿嘿……没什么啦。' },
        { jp: 'ステージのこと、考えてたの。', cn: '我在想舞台的事呢。' },
        { jp: 'あ、あの……疲れてない？大丈夫……？', cn: '啊，那个……你不累吗？没事吧……？' },
        { jp: '……うん、元気だよ。', cn: '……嗯，我很有精神哦。' },
        { jp: 'わっ……！あ、びっくりした……。', cn: '哇……！啊，吓我一跳……。' }
      ],
      running: [
        { jp: 'わ、私に任せて……！え、えい……！', cn: '交、交给我吧……！嘿、嘿……！' },
        { jp: 'うぅ……ちょっと待ってて……！', cn: '唔……稍微等一下……！' },
        { jp: 'すぐ終わるから……！もう少し……！', cn: '马上就结束了……！再等一下……！' },
        { jp: 'がんばる……！絶対、うまくやるから……！', cn: '我会加油的……！一定会做好的……！' },
        { jp: 'えっと、えっと……こう、かな……？', cn: '那个，那个……是这样吗……？' },
        { jp: 'ふふっ、いい感じ……！', cn: '呵呵，感觉不错……！' },
        { jp: '今、集中してるところ……！', cn: '我现在正集中精神呢……！' },
        { jp: 'あわわ……でも、負けないから……！', cn: '哇哇……不过，我不会输的……！' },
        { jp: '一緒に、がんばろ……！', cn: '一起，加油吧……！' },
        { jp: '……うん、まだまだ、ここからだよ。', cn: '……嗯，这才刚刚开始呢。' }
      ]
    }

    const COPYRIGHT =
      '本项目为同人性质的个人界面美化主题，仅供个人学习与界面美化使用，不涉及任何商业盈利或商业用途。草薙宁宁以及《世界计划》（Project Sekai）相关角色、图像、名称等内容，其著作权均归 Project Sekai & SEGA 及原权利人所有；本主题中的台词为粉丝向二次创作，并非官方台词。如权利方认为本主题存在不当使用，请随时联系我们，我们将在第一时间删除相关内容。'

    const WEBP_NOTE =
      '提示：背景图片目前仅支持 WebP（.webp）格式；PNG、JPG 等其他格式可能无法正常显示，请优先使用 WebP 图片。'

    const DEFAULTS = {
      bgMode: 'auto',
      bgDayImage: '',
      bgNightImage: '',
      bgBlur: 0,
      panelOpacity: 70,
      tachieImage: '',
      tachieScale: 100,
      tachieVisible: true,
      messagesEnabled: true,
      pos: null as { x: number; y: number } | null,
      defaultTachie: tachieImg,
      defaultDay: dayImg,
      defaultNight: nightImg
    }

    let state = Object.assign({}, DEFAULTS)
    const listeners = new Set<() => void>()
    function setState(patch: Record<string, unknown>) {
      state = Object.assign({}, state, patch)
      const fns = Array.from(listeners)
      for (let i = 0; i < fns.length; i++) {
        try {
          fns[i]()
        } catch (e) {}
      }
    }
    function subscribe(fn: () => void) {
      listeners.add(fn)
      return function () {
        listeners.delete(fn)
      }
    }
    function useStore() {
      const [, setTick] = useState(0)
      useEffect(function () {
        return subscribe(function () {
          setTick(function (t) {
            return t + 1
          })
        })
      }, [])
      return state
    }
    function pick<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)]
    }

    function isDayNow() {
      try {
        const h = new Date().getHours()
        return h >= 6 && h < 18
      } catch (e) {
        return true
      }
    }
    function dayMode() {
      if (state.bgMode === 'day') return true
      if (state.bgMode === 'night') return false
      return isDayNow()
    }
    function resolveBg() {
      if (dayMode()) {
        return state.bgDayImage || state.defaultDay || state.defaultNight || state.defaultTachie || ''
      }
      return state.bgNightImage || state.defaultNight || state.defaultDay || state.defaultTachie || ''
    }
    function resolveTachie() {
      return state.tachieImage || state.defaultTachie || ''
    }

    // ---------- 主题：侧边栏 + 对话区 统一不透明度（可调） ----------
    let themeDisposer: (() => void) | null = null
    let lastOpacity: number | null = null
    function applyTheme() {
      if (theme === undefined) return
      const op = state.panelOpacity / 100
      if (op === lastOpacity) return
      lastOpacity = op
      if (themeDisposer) {
        themeDisposer()
        themeDisposer = null
      }
      themeDisposer = theme.overrideTokens('nene-theme', {
        '--dsw-alias-bg-base': { light: 'rgba(255,255,255,' + op + ')', dark: 'rgba(21,21,23,' + op + ')' },
        '--dsw-alias-bg-layer-1': { light: 'rgba(255,255,255,0.70)', dark: 'rgba(35,35,36,0.70)' },
        '--dsw-alias-bg-layer-2': { light: 'rgba(255,255,255,0.66)', dark: 'rgba(44,44,46,0.66)' },
        '--dsw-alias-bg-overlay': { light: 'rgba(233,236,242,0.94)', dark: 'rgba(67,69,74,0.94)' },
        '--dsw-specific-sidebar-fill': { light: 'rgba(207,233,221,' + op + ')', dark: 'rgba(27,64,54,' + op + ')' }
      })
    }
    subscribe(applyTheme)
    applyTheme()

    // ---------- 静态样式 ----------
    const css =
      '\n.nene-tachie{position:fixed;z-index:25;pointer-events:auto;user-select:none;-webkit-user-select:none;cursor:grab;touch-action:none;display:flex;flex-direction:column;align-items:center}\n' +
      '.nene-tachie:active{cursor:grabbing}\n' +
      '.nene-tachie-img{height:100%;width:auto;display:block;pointer-events:none;-webkit-user-drag:none;object-fit:contain}\n' +
      '.nene-tachie-img.nene-running{animation:nene-bob 2.4s ease-in-out infinite}\n' +
      '.nene-tachie-placeholder{width:38vh;display:flex;align-items:center;justify-content:center;border-radius:20px;background:linear-gradient(160deg,#8e7cc3,#f3a6c9);color:rgba(255,255,255,0.9);font-size:18px;letter-spacing:2px}\n' +
      '.nene-bubble{position:relative;max-width:280px;margin-bottom:12px;background:var(--dsw-alias-bg-overlay,rgba(255,255,255,0.94));color:var(--dsw-alias-label-primary,#232327);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,0.1));border-radius:14px;padding:8px 12px;font-size:13px;line-height:1.55;box-shadow:0 4px 16px rgba(0,0,0,0.14);text-align:center;pointer-events:none}\n' +
      '.nene-bubble::after{content:"";position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);border:7px solid transparent;border-top-color:var(--dsw-alias-bg-overlay,rgba(255,255,255,0.94));border-bottom:none}\n' +
      '.nene-bubble-fade{animation:nene-bubble-in .5s ease}\n' +
      '.nene-state-chip{margin-top:8px;font-size:11px;line-height:16px;padding:2px 9px;border-radius:999px;background:var(--dsw-alias-bg-overlay,rgba(255,255,255,0.9));color:var(--dsw-alias-label-secondary,#61666b);border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,0.08));pointer-events:none}\n' +
      '.nene-state-chip.nene-busy{color:var(--dsw-alias-state-business-primary,#3964fe)}\n' +
      '@keyframes nene-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\n' +
      '@keyframes nene-bubble-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}\n'
    ctx.effect(() => injectCss(css))

    // 设置面板不透明 + 去掉对话区/侧边栏底部渐变 + 外层 frame 透明
    injectCss(
      '.VOzbGW_panel{background:#ffffff !important}body[data-ds-dark-theme] .VOzbGW_panel{background:#2c2c2e !important}' +
        '.wSkVaW_composerSeat{background:transparent !important}.qDHVXG_fade{display:none !important}' +
        'html, body, #root, .pI_x6G_frame{background:transparent !important}'
    )

    let imageVarDisposer: (() => void) | null = null
    let lastBgImage: string | null = null
    function applyImageVar() {
      const img = resolveBg()
      if (img === lastBgImage) return
      lastBgImage = img
      if (imageVarDisposer) {
        imageVarDisposer()
        imageVarDisposer = null
      }
      const value = img ? 'url("' + img + '")' : 'linear-gradient(160deg,#8e7cc3 0%,#f3a6c9 100%)'
      imageVarDisposer = injectCss(':root{--nene-bg-image:' + value + '}')
    }

    let blurDisposer: (() => void) | null = null
    let lastBlur: number | null = null
    function applyBlur() {
      const blur = state.bgBlur
      if (blur === lastBlur) return
      lastBlur = blur
      if (blurDisposer) {
        blurDisposer()
        blurDisposer = null
      }
      blurDisposer = injectCss(
        'body::before{content:"";position:fixed;inset:-48px;z-index:-1;pointer-events:none;background-image:var(--nene-bg-image,none);background-size:cover;background-position:center;background-repeat:no-repeat;filter:blur(' +
          blur +
          'px)}'
      )
    }

    function syncBackground() {
      applyImageVar()
      applyBlur()
    }
    subscribe(syncBackground)
    syncBackground()

    // 自动模式：每分钟重算一次，跨日夜边界时自动切换
    const timerSvc = ctx.get('timer')
    if (timerSvc !== undefined && typeof timerSvc.interval === 'function') {
      ctx.effect(function () {
        return timerSvc.interval(function () {
          syncBackground()
        }, 60000)
      })
    }

    // ---------- 状态检测（会话列表 running 位） ----------
    function useBusy(useSessions: any) {
      if (typeof useSessions !== 'function') return false
      return useSessions(function (s: any) {
        if (!s || !s.ids || !s.byId) return false
        const ids = s.ids
        for (let i = 0; i < ids.length; i++) {
          const sum = s.byId[ids[i]]
          if (sum && sum.running === true) return true
        }
        return false
      })
    }

    let lastBusy: boolean | null = null
    let dragData: { pointerId: number; offX: number; offY: number } | null = null

    function NeneOverlay(props: any) {
      const s = useStore() as any
      const busy = useBusy(props && props.useSessions)
      const [msg, setMsg] = useState(function () {
        return pick(LINES.greet)
      })
      const [fade, setFade] = useState(0)

      useEffect(
        function () {
          if (lastBusy !== null && lastBusy !== busy) {
            setMsg(pick(busy ? LINES.running : LINES.idle))
            setFade(function (k) {
              return k + 1
            })
          }
          lastBusy = busy
        },
        [busy]
      )

      useEffect(
        function () {
          if (!s.messagesEnabled) return undefined
          const timer = ctx.get('timer')
          if (timer === undefined || typeof timer.interval !== 'function') return undefined
          const delay = busy ? 7000 : 16000
          return timer.interval(function () {
            setMsg(pick(busy ? LINES.running : LINES.idle))
            setFade(function (k) {
              return k + 1
            })
          }, delay)
        },
        [busy, s.messagesEnabled]
      )

      if (!s.tachieVisible) return null

      const src = resolveTachie()
      const imgHeight = s.tachieScale * 0.44 + 'vh'
      const wrapStyle = s.pos
        ? { position: 'fixed', left: s.pos.x + 'px', top: s.pos.y + 'px' }
        : { position: 'fixed', right: '36px', bottom: '0px' }

      function onPointerDown(e: any) {
        if (e.button !== undefined && e.button !== 0) return
        const el = e.currentTarget
        try {
          el.setPointerCapture(e.pointerId)
        } catch (err) {}
        const rect = el.getBoundingClientRect()
        dragData = { pointerId: e.pointerId, offX: e.clientX - rect.left, offY: e.clientY - rect.top }
      }
      function onPointerMove(e: any) {
        if (!dragData || dragData.pointerId !== e.pointerId) return
        setState({ pos: { x: e.clientX - dragData.offX, y: e.clientY - dragData.offY } })
      }
      function onPointerUp(e: any) {
        if (dragData && dragData.pointerId === e.pointerId) dragData = null
      }

      const bubble =
        s.messagesEnabled && msg
          ? createElement(
              'div',
              { key: 'bubble-' + fade, className: 'nene-bubble nene-bubble-fade' },
              createElement('div', null, msg.jp + (busy ? '…' : '')),
              createElement('div', { style: { fontSize: 11, opacity: 0.75, marginTop: 3 } }, msg.cn)
            )
          : null

      const imgEl = src
        ? createElement('img', {
            className: 'nene-tachie-img' + (busy ? ' nene-running' : ''),
            src: src,
            alt: 'Kusanagi Nene',
            draggable: false,
            style: { height: imgHeight }
          })
        : createElement('div', { className: 'nene-tachie-placeholder', style: { height: imgHeight } }, '宁宁')

      return createElement(
        'div',
        {
          className: 'nene-tachie',
          style: wrapStyle,
          onPointerDown: onPointerDown,
          onPointerMove: onPointerMove,
          onPointerUp: onPointerUp,
          onPointerCancel: onPointerUp,
          title: '拖动可移动立绘'
        },
        bubble,
        imgEl,
        createElement('div', { className: 'nene-state-chip' + (busy ? ' nene-busy' : '') }, busy ? '执行中' : '待机')
      )
    }

    function NeneSettings(_props: any) {
      const s = useStore() as any
      const h = createElement

      const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--dsw-alias-label-secondary)', marginBottom: 5 }
      const inputStyle = {
        boxSizing: 'border-box',
        width: '100%',
        padding: '6px 10px',
        fontSize: 13,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-primary)',
        background: 'var(--dsw-alias-bg-base)',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 8,
        outline: 'none'
      }
      const hintStyle = { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', marginTop: 5, lineHeight: 1.6 }
      const rowStyle = { marginBottom: 18 }
      const rangeRowStyle = { display: 'flex', alignItems: 'center', gap: 10 }
      const rangeValStyle = {
        minWidth: 44,
        fontSize: 12,
        color: 'var(--dsw-alias-label-secondary)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
      const btnStyle = {
        padding: '6px 12px',
        fontSize: 12,
        lineHeight: '18px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-base)',
        color: 'var(--dsw-alias-label-primary)',
        cursor: 'pointer'
      }
      const chipStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: 'var(--dsw-alias-label-secondary)',
        cursor: 'pointer',
        userSelect: 'none'
      }

      function row(label: string, control: any, hint?: string) {
        return h(
          'div',
          { style: rowStyle },
          h('div', { style: labelStyle }, label),
          control,
          hint ? h('div', { style: hintStyle }, hint) : null
        )
      }

      function slider(label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (v: number) => void) {
        const ctrl = h(
          'div',
          { style: rangeRowStyle },
          h('input', {
            type: 'range',
            min: min,
            max: max,
            step: step,
            value: value,
            style: { flex: 1, margin: 0 },
            onChange: function (e: any) {
              onChange(Number(e.target.value))
            }
          }),
          h('span', { style: rangeValStyle }, value + (unit || ''))
        )
        return row(label, ctrl)
      }

      function textField(label: string, value: string, placeholder: string, onChange: (v: string) => void) {
        return row(
          label,
          h('input', {
            type: 'text',
            value: value,
            placeholder: placeholder,
            style: inputStyle,
            onChange: function (e: any) {
              onChange(e.target.value)
            }
          }),
          '留空则使用内置默认图片。'
        )
      }

      function checkbox(label: string, checked: boolean, onChange: (v: boolean) => void) {
        return h(
          'label',
          { style: chipStyle },
          h('input', {
            type: 'checkbox',
            checked: checked,
            onChange: function (e: any) {
              onChange(e.target.checked)
            }
          }),
          label
        )
      }

      function segmented(value: string, options: { value: string; label: string }[], onChange: (v: string) => void) {
        return h(
          'div',
          { style: { display: 'inline-flex', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 8, overflow: 'hidden' } },
          options.map(function (opt) {
            const active = opt.value === value
            return h(
              'button',
              {
                type: 'button',
                key: opt.value,
                onClick: function () {
                  onChange(opt.value)
                },
                style: {
                  padding: '5px 14px',
                  fontSize: 12,
                  lineHeight: '18px',
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'var(--dsw-alias-brand-primary)' : 'transparent',
                  color: active ? 'var(--dsw-alias-label-primary-inverted)' : 'var(--dsw-alias-label-secondary)'
                }
              },
              opt.label
            )
          })
        )
      }

      const allLoaded = !!(s.defaultTachie && s.defaultDay && s.defaultNight)
      const nowDay = dayMode()
      const bgLabel = s.bgMode === 'day' ? '白天（2.webp）' : s.bgMode === 'night' ? '夜间（3.webp）' : nowDay ? '白天（自动 · 2.webp）' : '夜间（自动 · 3.webp）'

      return h(
        'div',
        { style: { padding: '4px 2px 20px' } },
        h('h2', { style: { fontSize: 16, fontWeight: 700, margin: '0 0 2px', color: 'var(--dsw-alias-label-primary)' } }, '宁宁主题 · Nene Theme'),
        h('div', { style: hintStyle }, '草薙宁宁同人美化主题：日夜切换背景 + 可拖动立绘 + 状态台词。'),
        h(
          'div',
          { style: Object.assign({}, rowStyle, { marginTop: 18 }) },
          h('div', { style: labelStyle }, '状态'),
          h(
            'div',
            { style: hintStyle },
            (allLoaded ? '内置图片已加载（1.webp / 2.webp / 3.webp）' : '内置图片加载中…') + '　·　当前背景：' + bgLabel + '　·　可拖动右下角立绘调整位置。'
          )
        ),
        row(
          '背景模式',
          segmented(
            s.bgMode,
            [
              { value: 'auto', label: '自动(跟随时间)' },
              { value: 'day', label: '白天' },
              { value: 'night', label: '夜间' }
            ],
            function (v) {
              setState({ bgMode: v })
            }
          ),
          '自动：白天 6:00–18:00 用白天图，其余夜间用夜间图。'
        ),
        textField('背景图片 · 白天（默认 2.webp）', s.bgDayImage, '内置 2.webp', function (v) {
          setState({ bgDayImage: v })
        }),
        textField('背景图片 · 夜间（默认 3.webp）', s.bgNightImage, '内置 3.webp', function (v) {
          setState({ bgNightImage: v })
        }),
        h(
          'div',
          { style: { margin: '-6px 0 18px', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)', fontSize: 12, color: 'var(--dsw-alias-label-secondary)', lineHeight: 1.7 } },
          WEBP_NOTE
        ),
        slider('背景模糊程度', s.bgBlur, 0, 40, 1, ' px', function (v) {
          setState({ bgBlur: v })
        }),
        slider('面板不透明度（侧边栏 + 对话区）', s.panelOpacity, 0, 100, 1, ' %', function (v) {
          setState({ panelOpacity: v })
        }),
        textField('立绘图片（默认 1.webp）', s.tachieImage, '内置 1.webp', function (v) {
          setState({ tachieImage: v })
        }),
        slider('立绘大小', s.tachieScale, 0, 300, 1, ' %', function (v) {
          setState({ tachieScale: v })
        }),
        row(
          '立绘与消息',
          h(
            'div',
            { style: { display: 'flex', gap: 18, alignItems: 'center' } },
            checkbox('显示立绘', s.tachieVisible, function (v) {
              setState({ tachieVisible: v })
            }),
            checkbox('显示台词气泡', s.messagesEnabled, function (v) {
              setState({ messagesEnabled: v })
            })
          )
        ),
        row(
          '立绘位置',
          h(
            'button',
            { type: 'button', style: btnStyle, onClick: function () { setState({ pos: null }) } },
            '重置位置'
          )
        ),
        row(
          '恢复默认',
          h(
            'button',
            {
              type: 'button',
              style: btnStyle,
              onClick: function () {
                setState(Object.assign({}, DEFAULTS, { defaultTachie: state.defaultTachie, defaultDay: state.defaultDay, defaultNight: state.defaultNight }))
              }
            },
            '恢复全部默认'
          )
        ),
        h(
          'div',
          { style: { borderTop: '1px solid var(--dsw-alias-border-l2)', paddingTop: 14, marginTop: 6 } },
          h('div', { style: { fontSize: 12, color: 'var(--dsw-alias-label-tertiary)', lineHeight: 1.7 } }, COPYRIGHT)
        )
      )
    }

    // ---------- 注册 slot ----------
    slots.inject('shell.overlay', function () {
      return slots.register(
        { name: 'shell.overlay', id: 'nene-theme', order: 0 },
        function (props: any) {
          return createElement(NeneOverlay, { useSessions: props && props.useSessions })
        }
      )
    })

    slots.inject('settings.section', function () {
      return slots.register(
        { name: 'settings.section', id: 'nene-theme', order: 100, label: '宁宁主题' },
        function () {
          return createElement(NeneSettings, null)
        }
      )
    })
  }
}
