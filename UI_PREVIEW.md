# 🎨 UI Preview & Design Guide

> Visual guide to what you'll see when the app is running

## 🏠 Main Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Support Agent                     Always here to help│  ← Header
├─────────────────────────────────────────────────────────┤
│                                                          │
│     ┌───────────────────────────────────────────┐       │
│     │  🤖  Hi! How can I help you today?       │       │
│     │                                           │       │
│     │  I can help you track orders, process    │       │
│     │  returns, or find products                │       │
│     │                                           │       │
│     │  [📦 Track my order]  [🔄 Return an item]│       │  ← Empty State
│     │  [🔍 Find products]                       │       │
│     └───────────────────────────────────────────┘       │
│                                                          │
│                                                          │  ← Messages Area
│                                                          │    (Scrollable)
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐            │
│  │ Type your message...            📎   │  [Send]   │  ← Input Area
│  └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 💬 Chat Messages

### User Message (Right-aligned, Blue)
```
                              ┌──────────────────────┐  👤
                              │ Where is my order?   │
                              └──────────────────────┘
```

### Agent Message (Left-aligned, White)
```
🤖  ┌────────────────────────────────────────┐
    │ I'd be happy to help! Could you        │
    │ please provide your email address?     │
    └────────────────────────────────────────┘
```

## 📦 TrackingCard Component

When user provides email, this appears:

```
┌─────────────────────────────────────────────────────────┐
│  Order Tracking                           ETA: Jan 5    │  ← Header
│  Order #ORD-2024-001                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ●━━━━━━━●━━━━━━━●━━━━━━━○                            │  ← Progress Bar
│   📦       🚚       📍       ✓                           │
│ Ordered  Shipped In Transit Delivered                   │
│                      ↑ You are here                     │
│                                                          │
│  📍 Current Location                                     │
│  Memphis, TN                                            │
│  Tracking: TRK789456123                                 │
│                                                          │
│  Items in this order:                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │ Waterproof Hiking Jacket    Qty: 1   $159.99  │    │
│  │ Thermal Base Layer Set      Qty: 1    $89.99  │    │
│  └────────────────────────────────────────────────┘    │
│                                         Total: $249.98   │
│                                                          │
│  [          Report an Issue          ]                  │  ← Action Button
└─────────────────────────────────────────────────────────┘
```

## 🎁 ResolutionOptions Component

For returns, two cards appear side-by-side:

```
┌────────────────────┐  ┌────────────────────┐
│  ⭐ Best Value     │  │                    │
├────────────────────┤  ├────────────────────┤
│        🎁          │  │        💳          │
│                    │  │                    │
│ Instant Store      │  │ Original Payment   │
│ Credit             │  │ Refund             │
│                    │  │                    │
│   $259.98          │  │   $249.98          │
│   ̶$̶2̶4̶9̶.̶9̶8̶           │  │                    │
│ Includes $10 bonus │  │ Refunded to card   │
│                    │  │                    │
│ ✓ Available now    │  │ ⏰ 5-7 days wait   │
│ ✓ No waiting       │  │ • Return shipping  │
│ ✓ Never expires    │  │ • Full inspection  │
│                    │  │                    │
│ [    Select    ]   │  │ [    Select    ]   │
└────────────────────┘  └────────────────────┘
     ↑ GREEN BORDER         ↑ GRAY BORDER
     ↑ RECOMMENDED!
```

## 🛍️ ProductCarousel Component

Product search shows a grid:

```
Perfect Matches for You
Found 3 products matching your needs

┌──────────────────┐  ┌──────────────────┐
│ [Product Image]  │  │ [Product Image]  │
│                  │  │   Only 23 left!  │ ← Stock badge
├──────────────────┤  ├──────────────────┤
│ Alpine Pro       │  │ Arctic Explorer  │
│ Waterproof       │  │ Parka            │
│ Jacket           │  │                  │
│                  │  │                  │
│ Premium 3-layer  │  │ Ultra-warm       │
│ waterproof...    │  │ insulated...     │
│                  │  │                  │
│ $189.99 45 stock │  │ $249.99 23 stock │
│                  │  │                  │
│ [🛒 Add to Cart] │  │ [🛒 Add to Cart] │
└──────────────────┘  └──────────────────┘
```

## 🎨 Color Palette

```
Primary Colors:
- Blue:    #2563EB (actions, buttons, progress)
- Green:   #10B981 (success, store credit)
- Gray:    #6B7280 (text, borders)
- Orange:  #F59E0B (warnings, low stock)

Background:
- White:   #FFFFFF (cards, messages)
- Gray-50: #F9FAFB (page background)
- Gray-100:#F3F4F6 (subtle backgrounds)

Semantic:
- Success: Green border/background
- Warning: Orange badges
- Error:   Red (not shown in MVP)
- Info:    Blue gradients
```

## 🔤 Typography Scale

```
Headings:
h1: 24px / 1.5rem - font-semibold (Section titles)
h2: 20px / 1.25rem - font-semibold (Card headers)
h3: 18px / 1.125rem - font-semibold (Subheadings)
h4: 16px / 1rem - font-medium (Labels)

Body:
Regular: 14px / 0.875rem - font-normal
Small:   12px / 0.75rem - font-normal (Meta info)
Tiny:    11px / 0.6875rem - font-normal (Timestamps)

Font Family:
System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
```

## 📏 Spacing System

```
Based on Tailwind's spacing scale (1 unit = 0.25rem = 4px):

Component Padding:
- Cards: p-6 (24px)
- Buttons: px-4 py-2 (16px/8px)
- Small elements: p-3 (12px)

Component Gaps:
- Between cards: gap-4 (16px)
- Between sections: gap-6 (24px)
- Between items: gap-2 (8px)

Margins:
- Section spacing: mb-6 (24px)
- Element spacing: mb-3 (12px)
- Tight spacing: mb-1 (4px)
```

## 🎭 Interactive States

### Buttons
```
Default:
┌────────────────┐
│     Send       │  bg-blue-600, text-white
└────────────────┘

Hover:
┌────────────────┐
│     Send       │  bg-blue-700, slight shadow
└────────────────┘

Active (Click):
┌────────────────┐
│     Send       │  scale-[0.98] (pressed effect)
└────────────────┘

Disabled:
┌────────────────┐
│     Send       │  opacity-50, cursor-not-allowed
└────────────────┘
```

### Cards
```
Default:
┌─────────────────┐
│                 │  border-gray-200, shadow-sm
└─────────────────┘

Hover:
┌─────────────────┐
│                 │  shadow-lg (lifted effect)
└─────────────────┘

Selected:
┌─────────────────┐
│                 │  border-blue-500, ring-4 ring-blue-100
└─────────────────┘
```

## 📱 Responsive Breakpoints

### Desktop (1024px+)
```
┌─────────────────────────────────────────────┐
│  [────────── Wide chat interface ──────────]│
│  Components shown side-by-side (2 columns)  │
│  Max width: 896px (2xl container)           │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────┐
│  [──── Medium chat ────]        │
│  Components stack vertically    │
│  Comfortable padding            │
└─────────────────────────────────┘
```

### Mobile (< 768px)
```
┌───────────────────┐
│  [─ Compact ─]   │
│  Full width       │
│  Touch-optimized  │
│  Large buttons    │
└───────────────────┘
```

## ✨ Animation Effects

```
Component Entry:
- Fade in + slide up
- Duration: 300ms
- Easing: ease-out

Button Interactions:
- Hover: scale slightly (transition 200ms)
- Click: scale down (transition 150ms)
- Release: spring back

Loading States:
- Spinner: rotate 360° infinite
- Skeleton: pulse animation
- Progress bar: smooth width transition
```

## 🎯 Visual Hierarchy

```
MOST IMPORTANT
    ↓
1. Action Buttons (Blue, prominent)
2. Primary Content (Card headers, prices)
3. Secondary Content (Descriptions, labels)
4. Meta Information (Timestamps, tracking #s)
    ↓
LEAST IMPORTANT
```

## 🔍 Accessibility Features

```
✓ Semantic HTML (headers, nav, main)
✓ ARIA labels on buttons
✓ Keyboard navigation support
✓ Focus indicators (ring-2)
✓ Color contrast WCAG AA compliant
✓ Touch targets 44px minimum
```

## 📸 Screenshot Placeholders

When you run the app, expect to see:

1. **Empty State** (first load)
   - Welcome message with avatar
   - Three suggested action buttons
   - Clean, inviting layout

2. **Order Tracking View**
   - User message bubble (blue, right)
   - Agent response (white, left)
   - TrackingCard with progress bar
   - Smooth animations

3. **Product Search Results**
   - Grid of product cards
   - Images load progressively
   - Hover effects on cards
   - Add to Cart buttons

4. **Return Resolution**
   - Two comparison cards
   - Green "Best Value" badge
   - Visual highlighting
   - Clear pricing breakdown

## 🎬 Motion Design

```
Chat Message Entry:
┌─────┐
│  😊 │  Fade in from bottom
└─────┘  Slide up 10px
         Duration: 300ms

Component Render:
┌─────────┐
│ Content │  Fade in + Scale from 0.95 to 1.0
└─────────┘  Duration: 400ms
             Easing: ease-out

Button Hover:
[Button]      Scale: 1.0 → 1.02
              Shadow: sm → md
              Duration: 200ms
```

---

## 🎨 Design Inspiration

The design is inspired by:
- Apple's iOS Messages app (chat bubbles)
- Stripe Dashboard (clean cards)
- Shopify Admin (product grids)
- Linear (smooth animations)
- Vercel (minimal aesthetic)

**Result:** Professional, trustworthy, modern, delightful! ✨

---

Ready to see it live? Follow [SETUP.md](SETUP.md) to get started!
