---
description: >-
  Multiplexor（复用器），说白了就是一种选择器，根据条件从多个输入中选择一个做输出。Deultiplexor
  （解复用器），一个输入多个输出，根据条件将输入当成某一个输出，其它的输出置为0。
---

# 😀 Mux与DMux的实现

## Multiplexor（复用器）

首先我们先做一个二路复用器，即根据条件选择将a作为输出还是b作为输出。

根据思路写出相应的PARTS就可以了\~。

```
/** 
 * Multiplexor:
 * out = a if sel == 0
 *       b otherwise
 * 思路：Mux = Or(And(b, sel), And(a, Not(sel)))
 */

CHIP Mux {
    IN a, b, sel;
    OUT out;

    PARTS:
    And(a = b, b = sel, out = o1);

    Not(in = sel, out = notSel);
    And(a = a, b = notSel, out = o2);

    Or(a = o1, b = o2, out = out);
}
```

### Demultiplexor（解复用器）

简单的二路解复用器，根据条件将in复制给a或者是b。

```
/**
 * Demultiplexor:
 * {a, b} = {in, 0} if sel == 0
 *          {0, in} if sel == 1
 * 思路: out: a = And(in, Not(sel)), b = And(in, sel)
 * and操作 用1 and 谁就返回谁 例如 1 and 1 = 1; 1 and 0 = 0;
 */

CHIP DMux {
    IN in, sel;
    OUT a, b;

    PARTS:
    Not(in = sel, out = n1);
    And(a = in, b = n1, out = a);
    And(a = in, b = sel, out = b);
}

```

相信你已经发现了，如果是4路的就需要两个bit作为条件，8路就需要三个bit作为条件\~\~\~

下面我们给出相应的实现！（利用已经做出的二路复用器，抽象的思维！）

```
/**
 * 4-way demultiplexor:
 * {a, b, c, d} = {in, 0, 0, 0} if sel == 00
 *                {0, in, 0, 0} if sel == 01
 *                {0, 0, in, 0} if sel == 10
 *                {0, 0, 0, in} if sel == 11
 * 从上述代码可以发现 ab 的第二位都是 0，cd 的第二位都是 1
 * 利用这一特性先对 sel 的第二位进行一个 DMux 操作
 * 如果第二位是 0，它只有两种可能：ab，如果是 1，则是 cd
 * 然后再对 sel 的第一位进行操作，对于 ab 来说，第一位为 0 则是 a，否则为 b
 * 对于 cd 来说，第一位为 0 则是 c，否则为 d
 */

CHIP DMux4Way {
    IN in, sel[2];
    OUT a, b, c, d;

    PARTS:
    DMux(in = in, sel = sel[1], a = o1, b = o2);

    DMux(in = o1, sel = sel[0], a = a, b = b);
    DMux(in = o2, sel = sel[0], a = c, b = d);
}
```

```
/**
 * 8-way demultiplexor:
 * {a, b, c, d, e, f, g, h} = {in, 0, 0, 0, 0, 0, 0, 0} if sel == 000
 *                            {0, in, 0, 0, 0, 0, 0, 0} if sel == 001
 *                            etc.
 *                            {0, 0, 0, 0, 0, 0, 0, in} if sel == 111
 */

CHIP DMux8Way {
    IN in, sel[3];
    OUT a, b, c, d, e, f, g, h;

    PARTS:
    DMux4Way(in = in, sel = sel[1..2], a = o1, b = o2, c = o3, d = o4);
    DMux(in = o1, sel = sel[0], a = a, b = b);
    DMux(in = o2, sel = sel[0], a = c, b = d);
    DMux(in = o3, sel = sel[0], a = e, b = f);
    DMux(in = o4, sel = sel[0], a = g, b = h);
}
```

以上我们都是单bit输入的，如果是多bit的呢？也很简单对每个bit单独处理就可以了！下面我们给出16位的实现，实际上32位的就可以用两个16位的实现。

```
/**
 * 16-bit multiplexor: 
 * for i = 0..15 out[i] = a[i] if sel == 0 
 *                        b[i] if sel == 1
 */

CHIP Mux16 {
    IN a[16], b[16], sel;
    OUT out[16];

    PARTS:
    Mux(a = a[0], b = b[0], sel = sel, out = out[0]);
    Mux(a = a[1], b = b[1], sel = sel, out = out[1]);
    Mux(a = a[2], b = b[2], sel = sel, out = out[2]);
    Mux(a = a[3], b = b[3], sel = sel, out = out[3]);
    Mux(a = a[4], b = b[4], sel = sel, out = out[4]);
    Mux(a = a[5], b = b[5], sel = sel, out = out[5]);
    Mux(a = a[6], b = b[6], sel = sel, out = out[6]);
    Mux(a = a[7], b = b[7], sel = sel, out = out[7]);
    Mux(a = a[8], b = b[8], sel = sel, out = out[8]);
    Mux(a = a[9], b = b[9], sel = sel, out = out[9]);
    Mux(a = a[10], b = b[10], sel = sel, out = out[10]);
    Mux(a = a[11], b = b[11], sel = sel, out = out[11]);
    Mux(a = a[12], b = b[12], sel = sel, out = out[12]);
    Mux(a = a[13], b = b[13], sel = sel, out = out[13]);
    Mux(a = a[14], b = b[14], sel = sel, out = out[14]);
    Mux(a = a[15], b = b[15], sel = sel, out = out[15]);
}

```

先给出16位的Mux，很简单就是逐位Mux。

```
/**
 * 4-way 16-bit multiplexor:
 * out = a if sel == 00
 *       b if sel == 01
 *       c if sel == 10
 *       d if sel == 11
 * 从上述思路可以发现 sel 的第二位决定了是 ab 还是 cd
 * 如果是 sel[1] 是 0 就是结果只能是 ab 中的一个
 * 同理，sel[1] 是 1 就是结果只能是 cd 中的一个
 * 所以我们可以先通过 sel[0] 做两次选择， 从 ab 中选一个，再从cd中选一个
 * 再根据 sel[1] 选出真正的数
 */

CHIP Mux4Way16 {
    IN a[16], b[16], c[16], d[16], sel[2];
    OUT out[16];

    PARTS:
    Mux16(a = a, b = b, sel = sel[0], out = o1);
    Mux16(a = c, b = d, sel = sel[0], out = o2);

    Mux16(a = o1, b = o2, sel = sel[1], out = out);
}
```

这样就是4路16bit的Mux啦！

```
/**
 * 8-way 16-bit multiplexor:
 * out = a if sel == 000
 *       b if sel == 001
 *       etc.
 *       h if sel == 111
 */

CHIP Mux8Way16 {
    IN a[16], b[16], c[16], d[16],
       e[16], f[16], g[16], h[16],
       sel[3];
    OUT out[16];

    PARTS:
    Mux4Way16(a = a, b = b, c = c, d = d, sel = sel[0..1], out = o1);
    Mux4Way16(a = e, b = f, c = g, d = h, sel = sel[0..1], out = o2);

    Mux16(a = o1, b = o2, sel = sel[2], out = out);
}
```

两个4路的就可以组成8路的！
