# 妞妞的 Hello Kitty 小世界

一个送给妞妞的生日纪念网页。单页纵向滚动，包含六个章节：开场、20 张照片回忆、恋爱时间轴、300 天情书、幸运扭蛋机、隐藏礼物。

技术栈：React 19、Vite 8、Framer Motion、Lucide、纯 CSS。没有背景音乐。

## 先运行起来

项目位置：`C:\Users\35798\kitty-birthday`

```bash
cd C:\Users\35798\kitty-birthday
npm install
npm run dev
```

浏览器打开终端提示的地址，通常是 <http://localhost:5173>。

生产构建与本地预览：

```bash
npm run build
npm run preview
```

## 目录结构

```text
kitty-birthday/
├─ public/
│  ├─ photos/                 # 27 张已经压缩好的照片
│  ├─ favicon.svg
│  └─ robots.txt
├─ src/
│  ├─ components/
│  │  ├─ Opening.jsx
│  │  ├─ PhotoGallery.jsx
│  │  ├─ Timeline.jsx
│  │  ├─ LoveLetter.jsx
│  │  ├─ GachaMachine.jsx
│  │  ├─ FinalGift.jsx
│  │  ├─ Navigation.jsx
│  │  ├─ SiteFooter.jsx
│  │  ├─ SectionHeading.jsx
│  │  ├─ PhotoImage.jsx
│  │  ├─ Modal.jsx
│  │  └─ Decorations.jsx
│  ├─ content/content.js      # ★ 所有内容都在这里改
│  ├─ lib/gacha.js            # 抽取 / 收藏去重逻辑
│  ├─ styles/
│  │  ├─ theme.css
│  │  ├─ global.css
│  │  └─ responsive.css
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ package.json
└─ README.md
```

## 怎么替换六张扭蛋照片和对应文字

这是本次的重点。照片和文字是**六个独立对象**，每颗扭蛋永远从同一个对象里读取照片、标题和文字。

### 1. 替换图片文件

把自己的六张照片放进 `public/photos/`，可以沿用现有文件名：

```text
gacha-01.jpg
gacha-02.jpg
gacha-03.jpg
gacha-04.jpg
gacha-05.jpg
gacha-06.jpg
```

建议使用 JPG，长边 1200–1600px 左右，单张尽量控制在 500KB 以内。手机端会按屏幕宽度显示，过大的原图只会增加加载时间。

### 2. 改 `src/content/content.js`

找到 `content.gacha.items`：

```js
items: [
  {
    id: "gacha-01",              // 唯一 id，不要重复
    number: "01",                // 显示编号
    photo: "/photos/gacha-01.jpg",
    photoAlt: "照片说明",
    title: "专属标题 1",
    text: "与第一张照片严格对应的文字",
    color: "#FFD6E5",            // 扭蛋浅色
    colorDeep: "#F48FB1",        // 扭蛋深色
  },
  // ... 06
]
```

需要替换时，成对修改每个对象里的 `photo / title / text`。**不要**另外做“照片数组 + 文字数组”，也不要用两次随机去分别取照片和文字，否则会出现照片 A 配文字 B 的情况。

### 3. 如果照片尺寸变了

`src/content/content.js` 顶部的 `photoSizes` 只用于提前占位、减少加载时的页面跳动。不是必需字段；如果新照片尺寸和原来一样，不用改。如果宽高不同，建议同步改：

```js
"/photos/gacha-01.jpg": [1050, 1400], // [宽, 高]
```

### 4. 抽取记录的重置

- 开发环境：扭蛋机收藏架底部有一个很小的「重置测试收藏」按钮。
- 正式环境：这个按钮会被构建移除。需要清空时，在浏览器开发者工具中删除 `localStorage` 的 `niuniu-kitty-gacha-v1`，或换成新的 `storageKey`。
- 收藏记录只保存 `id`，不保存照片或文字；所以修改同一 `id` 对应的照片/文字后，已经收集过的那一颗会自动显示新内容。如果改了 `id`，旧记录会被自动忽略，不会报错。

## 修改其他章节

所有可见文案、日期、照片路径都在 `src/content/content.js`。

### 基础信息

```js
meta: {
  name: "妞妞",
  startDate: "2026-01-21",
  day300Date: "2026-11-17",
  day300InclusiveDate: "2026-11-16",
  birthday: "", // 生日日期未提供，故意留空。例如填 "2026-12-01"
  coreLine: "希望我们可以陪伴彼此很久，很久。",
}
```

- 按「相隔 300 个完整自然日」计算，2026-01-21 到 2026-11-17 正好 300 天。
- 如果把恋爱首日算作第 1 天，第 300 天是 2026-11-16。
- 生日日期没有提供，所以没有显示、也没有编造。填写后首页底部会自动出现生日小标签。
- 页面中所有涉及 300 天的文案均从内容文件和上述日期读取。

### 20 张照片回忆

改 `content.gallery.photos`。每张照片有 `photo / alt / date / title / description`：

- `date` 为空时，照片卡片显示 `MEMORY 01` 这类编号。
- 填写 `date` 后，卡片自动显示日期。
- 照片保持自己的原始比例展示，不会强行裁切；点击后打开大图。
- 如果要换第 1 张照片，可直接覆盖 `public/photos/memory-01.jpg`，或者更新 `photo` 路径。
- `photoSizes` 同步更新（可选）。

### 时间轴

改 `content.timeline.nodes`。当前时间轴包含：
- 2026-01-21 的恋爱开始节点，使用 `public/photos/timeline-first-day.jpg`；
- 「一个想永远记住的日子」节点，使用 `public/photos/timeline-shenlin.jpg`；日期暂留为「等你来写」，没有编造具体日期；
- 一个写向未来的愿望节点。

原「我们的第 300 天」时间轴节点已经删除，因此时间轴底部不再显示第 300 天的日期注释。第 300 天相关文案仍保留在首页和情书章节中。

你可以替换或增加节点，每个节点支持 `date / eyebrow / title / text / photo / photoAlt / tag`。`photo` 为 `null` 时显示留白卡片。

### 300 天情书

改 `content.letter`：

- `paragraphs` 是正文段落，会逐字显示；
- `highlight` 是核心句，打字完成后以粉色高亮出现；
- 信封文案、点击提示、落款、P.S. 也都在这里；
- `stampText` 是信封邮票上的数字。

打字速度在 `src/components/LoveLetter.jsx` 的 `26` 毫秒间隔处；如果想更快/更慢可以调整。用户也可以点「轻点跳过打字」。

### 隐藏礼物

改 `content.gift`：

- `photo` 是最后一张合照，当前使用的是 `public/photos/final-gift.jpg`；
- `paragraphs / highlight / birthdayLine / signature` 是隐藏信件；
- 礼物盒中的英文小标签也通过 `boxFor / boxName / boxTag` 配置。

### 称呼、导航、底部文字

- 顶部导航：`content.nav`
- 固定界面文案：`content.ui`
- 页脚：`content.footer`
- 主题色：`src/styles/theme.css` 的 CSS 变量

## 本地用 iPhone 预览

1. 电脑和 iPhone 连同一个 Wi-Fi。
2. 在项目目录运行：

```bash
npm run dev -- --host 0.0.0.0
```

3. 在电脑终端查看 `Network` 地址，或在 Windows 终端执行 `ipconfig` 找到 IPv4 地址，例如 `192.168.1.23`。
4. iPhone Safari 打开 `http://192.168.1.23:5173`。
5. 如果打不开，检查 Windows 防火墙是否允许 Node.js 访问专用网络。

页面已经处理了 `env(safe-area-inset-*)` 安全区域、iPhone 尺寸下的横向溢出、底部固定导航、手机端触控尺寸和 `prefers-reduced-motion`。

## 部署到 Vercel

### 方式 A：Vercel 网站导入

1. 把 `C:\Users\35798\kitty-birthday` 推到 GitHub/GitLab 仓库。
2. 打开 <https://vercel.com/new>，导入该仓库。
3. Framework Preset 选 **Vite**。
4. 保持默认：
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. 点击 Deploy。完成后把 `https://xxx.vercel.app` 链接发到 iPhone 上，用 Safari 打开即可。

### 方式 B：命令行

```bash
cd C:\Users\35798\kitty-birthday
npx vercel
# 按提示登录并确认项目设置
npx vercel --prod
```

### iPhone 上打开

- 直接使用 Safari 打开 Vercel 链接。
- 想更像一个 App：Safari 分享按钮 → 添加到主屏幕。
- 页面不需要全屏权限、不会锁滚动，也没有背景音乐。
- 已设置 `viewport-fit=cover`，底部导航会避开 iPhone 的 Home Indicator。

> 照片是私人内容。部署到 Vercel 后，拿到链接的人都能访问。页面已加 `noindex` 和 `robots.txt`，搜索引擎一般不会收录，但这不等于访问密码。若需要真正限制访问，请使用 Vercel 的 Password Protection 等方案，或不要把私人照片放到公开部署上。

## 本次已经验证

- `npm run build`：通过。
- `npm run lint`：通过，无警告。
- 连续抽取六次：恰好得到六个不同 id，无重复。
- 每一颗扭蛋的照片、标题、文字来自同一个 content 对象。
- 刷新后收藏记录保留，顺序保持；六个抽完后旋钮禁用。
- 快速连点只产生一次抽取。
- 点击收藏架只查看，不改变收藏或重新抽取。
- 图片加载失败时显示 Kitty 占位图。
- 390×844、320px、375px、430px、768px、1024px、1440px 下均无横向滚动。
- Chrome/Edge 的 iPhone 尺寸模拟下测试了信封、打字、扭蛋、礼物盒、大图预览和导航。

实际的 iPhone Safari 仍建议在自己手机上完整走一遍，因为真机字体、安全区域和 Safari 版本可能与桌面模拟略有差异。

## 说明

- 照片来自你提供的 `Pictures\新建文件夹` 和 `Pictures\20`，已统一压缩、旋转校正并移动到 `public/photos/`。
- Hello Kitty 形象与蝴蝶结是项目内绘制的原创 SVG 风格插画，没有抓取或使用来源不明的官方图片素材。
- 生日日期保持空白；时间轴没有编造任何未提供的具体日期或恋爱经历。
