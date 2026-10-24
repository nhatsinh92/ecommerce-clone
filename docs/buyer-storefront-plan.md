# Buyer storefront plan

The buyer keeps layout A, the rail. Web, API, and Postgres stay separate. The buyer can browse, keep a cart, register, pay cash on delivery, and see only their own orders.

PR order is pr-1, pr-2, pr-3, pr-4, pr-5, pr-6.

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `pstack/skills/poteto-mode/playbooks/autopilot-stack.md`. Owners stop at STACK-READY. The operator lands pr-1 through pr-6. pr-2, pr-3, pr-4, pr-5, and pr-6 wait for review in chat before that landing.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] Read these from trunk at program start. Re-read them at every tick.
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/autopilot-stack.md`
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/autopilot-full.md`
  - [ ] `git show origin/main:pstack/skills/swarm/SKILL.md`
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/opening-a-pr.md`
  - [ ] `git show origin/main:pstack/skills/principle-sequence-verifiable-units/SKILL.md`
  - [ ] `git show origin/main:pstack/skills/principle-prove-it-works/SKILL.md`
- [ ] If `origin/main` is absent, read those same files from the local pstack cache and record the fallback.
- [ ] On the operator's go, arm the audit tick as `/loop 1h` with the tick prompt below. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook from trunk. Audit the operation against it and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a short status message to the operator in chat only when the audit found a tracked change that no earlier status message reported, such as a PR opened, a code-ready head, a round launched or closed, a verdict, a merge, a stuck agent and the action taken, a blocker added or cleared, or a decision only the operator can make. Name every such change and nothing else. Do not repeat a table, the merged list, or an unchanged blocker. If the audit found none, end the turn with no reply text. Either way, log this tick's row in your decision trail. The row names the items reported, or none."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle `playbooks/autopilot-stack.md` names.
- [ ] Follow this dependency graph. Start dependent work only after its parent is the base branch.
  - [ ] pr-1 branches from `main`.
  - [ ] pr-2 after pr-1.
  - [ ] pr-3 after pr-2.
  - [ ] pr-4 after pr-3.
  - [ ] pr-5 after pr-4.
  - [ ] pr-6 after pr-5.
- [ ] Hold the file boundaries. pr-1 touches `docker-compose.yml` and `apps/api/**` only. pr-2 adds `apps/web/**` and the catalog routes. pr-3 touches cart routes and the cart page. pr-4 touches auth routes and the login page. pr-5 touches checkout routes and the checkout page. pr-6 touches the order-list route and the order-list page.
- [ ] Hold the review gate. pr-2, pr-3, pr-4, pr-5, and pr-6 change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`. If `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, per Opening a PR. Use the run's built-in PR tool when it has one, else `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch.
- [ ] Run the repo lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Run deslop before each commit and no-comments before review.
- [ ] Triage every Bugbot and security-reviewer comment per `pstack/skills/poteto-mode/references/bugbot-triage.md`.
- [ ] Rebase onto current trunk before the code-ready report and babysit. Keep that merge base in fix rounds. Rebase again only at merge prep, on a `git merge-tree` conflict with trunk, or on a CI failure that comes from a change on trunk.

### Verdict and merge, for every PR

- [ ] A full swarm runs once, at the code-ready head. Another full swarm runs only for new behavior, a redesign, or a large new diff. A rebase, a merge-conflict resolution, or a minor fix gets a single verifier at the new head. Run each full swarm per `pstack/skills/swarm/SKILL.md`. One gates lane. The ten live lanes from the PR **Verify, live** block. The perf lane from its **Verify, perf** block. Two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body. The root audits the receipts in the merge-ready report before the verdict.
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner, including a defect that a lane filed as a note. A new head gets a fresh verdict, except for results that stay valid under the patch-id rule in `playbooks/shipping.md`.
- [ ] The root appends each clean PR onto its parent branch. The operator lands the stack bottom-up per `playbooks/shipping.md`. Owners do not merge.

### Boot recipe, for every live lane

Each live lane runs on its own cloud VM at the PR head. `control-ui` from `cursor-team-kit` is the browser driver when it is installed. Until then, drive the browser with the IDE browser tools and record that fallback.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] From pr-1 onward, run `docker compose up -d` and `npm run dev --prefix apps/api`. From pr-2 onward, also run `npm run dev --prefix apps/web`. Wait until `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/health` prints `200`. From pr-2 onward, also wait until `http://127.0.0.1:3000` returns `200`.
- [ ] Deliver clicks and typing only through the browser driver. Read logs with `docker compose logs` and `curl`.
- [ ] Save every screenshot to `/tmp/swarm-<pr-id>/worker-<n>/<slug>.png` and return the paths with the report.

## Frame the repo and seed products (pr-1)

**Depends on.** None.

**Files.**

- [ ] Create `docker-compose.yml`.
- [ ] Create `apps/api/package.json`.
- [ ] Create `apps/api/prisma/schema.prisma`.
- [ ] Create `apps/api/prisma/seed.js`.
- [ ] Create `apps/api/src/server.js`.
- [ ] Create `apps/api/seed.test.js`.

**Build.**

- [ ] Add a Postgres service on a named volume in `docker-compose.yml` and a `Product` model in `apps/api/prisma/schema.prisma`. Lane 7 needs the volume to survive a restart.
- [ ] Seed 16 products in `apps/api/prisma/seed.js` from the names, prices, list prices, sold counts, ratings, category ids, and blurbs in `scratch/storefront-layouts/store.js`. Upsert by the prototype id (`p1` to `p16`) so lane 10 can reseed without duplicates.
- [ ] Add `GET /health` in `apps/api/src/server.js`.
- [ ] Add `npm run list-products` in `apps/api/package.json` so it prints one product name per line.
- [ ] Initialize git on the repo root when `HEAD` does not exist.

**You see.**

- [ ] `docker compose up -d` leaves Postgres accepting connections.
- [ ] `npm run list-products --prefix apps/api` prints `Điện thoại A17 128GB` and 15 other names.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/seed.test.js` expects 16 products and the name `Điện thoại A17 128GB`, and still 16 after a second seed run. Start Postgres with `docker compose up -d`, then run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the list command at trunk and at head. Trunk has no app. Record that, and gate 16 seeded names on the head. Save `/tmp/swarm-pr-1/worker-1/regression.png`. Pass when the head prints 16 names and trunk has no list command.
- [ ] Lane 2. Start Postgres. Save `/tmp/swarm-pr-1/worker-2/compose.png`. Pass when Postgres accepts connections.
- [ ] Lane 3. Run the list command. Save `/tmp/swarm-pr-1/worker-3/list.png`. Pass when the output contains `Điện thoại A17 128GB`.
- [ ] Lane 4. Count the printed names. Save `/tmp/swarm-pr-1/worker-4/count.png`. Pass when the count is 16.
- [ ] Lane 5. List products whose category id is `phone`. Save `/tmp/swarm-pr-1/worker-5/phones.png`. Pass when both phone names from the prototype catalog appear and no other category appears.
- [ ] Lane 6. Read the A17 row. Save `/tmp/swarm-pr-1/worker-6/a17.png`. Pass when its price is `8990000` and its sold count is `2140`.
- [ ] Lane 7. Restart the Postgres container and list again. Save `/tmp/swarm-pr-1/worker-7/restart.png`. Pass when the same 16 names are still present.
- [ ] Lane 8. Call `GET /health`. Save `/tmp/swarm-pr-1/worker-8/health.png`. Pass when the status is `200`.
- [ ] Lane 9. Confirm the web app is not in this PR. Save `/tmp/swarm-pr-1/worker-9/no-web.png`. Pass when `apps/web` is absent and port `3000` is closed.
- [ ] Lane 10. Run the seed a second time. Save `/tmp/swarm-pr-1/worker-10/reseed.png`. Pass when the list is still 16 names.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for `npm run list-products --prefix apps/api` after Postgres accepts connections, plus whether the output has 16 names.
- [ ] Probe. Time the list command on trunk and on the head, trunk first, then head, then trunk again. Trunk has no command. Record that miss. The head must print the names.
- [ ] Baseline. Record the trunk result first. The trunk result is that the command is absent.
- [ ] Rule. Fail when the head takes 5 seconds or longer, or when it prints fewer than 16 names.

**Review gate.** None. pr-1 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-1 onto `main` as the stack root. The operator lands it. The owner does not merge.

## Show the catalog on layout A (pr-2)

**Depends on.** pr-1.

**Files.**

- [ ] Create `apps/web`.
- [ ] Create the home, category, search, and product routes under `apps/web`.
- [ ] Edit `apps/api/src/server.js` to add the catalog reads.
- [ ] Create `apps/api/catalog.test.js`.

**Build.**

- [ ] Scaffold `apps/web` as a Next.js app on port `3000`.
- [ ] Rewrite `/api/*` to `http://127.0.0.1:4000/*` in `apps/web/next.config.js`. The cart cookie in pr-3 and the session cookie in pr-4 then stay first-party on port `3000`, with no CORS setup.
- [ ] Add `GET /products` and `GET /products/:id` in `apps/api/src/server.js`. `GET /products` accepts `category` and `q`.
- [ ] Build the home at `/` with a left **Danh mục** rail, the banner **Freeship mọi đơn**, and a 4-column grid at a 1440px window.
- [ ] Build `/c/[category]`, `/search`, and `/p/[id]` on that same rail chrome.
- [ ] Show the red price, the struck list price, the percent off, and **Đã bán** on every card.

**You see.**

- [ ] Open `http://127.0.0.1:3000`. The first row has 4 product cards, and one of them is `Điện thoại A17 128GB`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/catalog.test.js` covers an empty query, category `book`, query `serum`, and an unknown id. Run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open `/` on trunk and on the head. Trunk has no page. Record that, and gate the seeded home on the head. Save `/tmp/swarm-pr-2/worker-1/regression.png`. Pass when the head shows `Gợi ý hôm nay` and trunk does not.
- [ ] Lane 2. Open the home at 1440px width. Save `/tmp/swarm-pr-2/worker-2/home.png`. Pass when the **Danh mục** rail is on the left and the first card row holds 4 cards.
- [ ] Lane 3. Read the first card. Save `/tmp/swarm-pr-2/worker-3/card.png`. Pass when it shows a percent, a price, and **Đã bán**.
- [ ] Lane 4. Choose **Điện thoại**. Save `/tmp/swarm-pr-2/worker-4/phones.png`. Pass when the heading is `Điện thoại` and both phone names are the only cards.
- [ ] Lane 5. Search `serum`. Save `/tmp/swarm-pr-2/worker-5/serum.png`. Pass when the only card is `Serum vitamin C 30ml`.
- [ ] Lane 6. Search `zzzz`. Save `/tmp/swarm-pr-2/worker-6/empty.png`. Pass when the page shows `Không có sản phẩm khớp`.
- [ ] Lane 7. Open `Điện thoại A17 128GB`. Save `/tmp/swarm-pr-2/worker-7/product.png`. Pass when **Thêm vào giỏ** and **Mua ngay** sit on one row.
- [ ] Lane 8. Open a product id that does not exist. Save `/tmp/swarm-pr-2/worker-8/missing.png`. Pass when the page shows `Không thấy sản phẩm`.
- [ ] Lane 9. Choose **Tất cả**. Save `/tmp/swarm-pr-2/worker-9/all.png`. Pass when the grid shows 16 cards.
- [ ] Lane 10. Choose **Sách** after a search. Save `/tmp/swarm-pr-2/worker-10/books.png`. Pass when the search box is empty and the only cards are the two books.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for `curl` of `http://127.0.0.1:3000`, plus whether the body contains `Điện thoại A17 128GB`.
- [ ] Probe. Send one warm-up request, because Next.js dev compiles a route on its first hit. Then time that `curl` on trunk and on the head, trunk first, then head, then trunk again. Trunk has no server. Record that miss.
- [ ] Baseline. Record the trunk result first. The trunk result is that port `3000` is closed.
- [ ] Rule. Fail when the head `curl` takes 1 second or longer, or when the body lacks `Điện thoại A17 128GB`.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 2 screenshots into `docs/review/pr-2-review-home.png`.
- [ ] Record a 30 to 60 second video of the home, a category, a search, and a product on a lane VM. Save it as `docs/review/pr-2-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-2 onto the pr-1 branch. The operator lands it after pr-1. The owner does not merge.

## Keep a cart across reload (pr-3)

**Depends on.** pr-2.

**Files.**

- [ ] Edit `apps/api/prisma/schema.prisma` to add `Cart` and `CartLine`.
- [ ] Edit `apps/api/src/server.js` to add cart routes.
- [ ] Create the cart page in `apps/web`.
- [ ] Create `apps/api/cart.test.js`.

**Build.**

- [ ] Store an anonymous cart on an httpOnly cookie in `apps/api/src/server.js`.
- [ ] Add a line from **Thêm vào giỏ**, change its quantity, and delete it.
- [ ] Compute every line total and the cart total in the API from the `Product` price. Reject an unknown product id and a quantity that is not a whole number of at least 1 with `400`.
- [ ] Put the cart summary on the right at a 1440px window, with **Mua hàng** in that summary.
- [ ] Leave the line quantity unchanged after a reload.

**You see.**

- [ ] Add `Điện thoại A17 128GB`, set the quantity to 2, reload, and still see quantity 2 and total `17.980.000₫`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/cart.test.js` adds a line, sets quantity to 2, reads the cart again, and expects quantity 2 and total `17980000`. It also expects `400` for quantity 0 and for an unknown product id. Run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the cart on trunk and on the head. Trunk has no cart. Record that, and gate a persisted quantity on the head. Save `/tmp/swarm-pr-3/worker-1/regression.png`. Pass when the head keeps quantity 2 after reload and trunk has no cart page.
- [ ] Lane 2. Add one phone from the product page. Save `/tmp/swarm-pr-3/worker-2/add.png`. Pass when the header badge is 1.
- [ ] Lane 3. Raise the quantity to 2. Save `/tmp/swarm-pr-3/worker-3/qty.png`. Pass when the line total is `17.980.000₫`.
- [ ] Lane 4. Reload the cart. Save `/tmp/swarm-pr-3/worker-4/reload.png`. Pass when the quantity is still 2.
- [ ] Lane 5. Lower the quantity to 1. Save `/tmp/swarm-pr-3/worker-5/dec.png`. Pass when the line total is `8.990.000₫`.
- [ ] Lane 6. Delete the line. Save `/tmp/swarm-pr-3/worker-6/empty.png`. Pass when the page shows `Giỏ hàng trống`.
- [ ] Lane 7. Add the phone and `Serum vitamin C 30ml`. Save `/tmp/swarm-pr-3/worker-7/two.png`. Pass when both names are on the cart.
- [ ] Lane 8. Open the cart with no lines and look at **Mua hàng**. Save `/tmp/swarm-pr-3/worker-8/disabled.png`. Pass when **Mua hàng** does not open checkout.
- [ ] Lane 9. Add a line, then open the cart in a second browser profile. Save `/tmp/swarm-pr-3/worker-9/other.png`. Pass when the second profile shows `Giỏ hàng trống`.
- [ ] Lane 10. Add a line, go home, and reload. Save `/tmp/swarm-pr-3/worker-10/badge.png`. Pass when the header badge is still 1.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for `GET /cart` after a quantity update, plus whether the body says quantity 2.
- [ ] Probe. Time `GET /cart` on trunk and on the head, trunk first, then head, then trunk again. Trunk has no cart route. Record that miss.
- [ ] Baseline. Record the trunk result first. The trunk result is that `GET /cart` is absent.
- [ ] Rule. Fail when the head `GET /cart` takes 1 second or longer, or when the quantity is not 2.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 4 screenshots into `docs/review/pr-3-review-reload.png`.
- [ ] Record a 30 to 60 second video of add, quantity change, reload, and delete on a lane VM. Save it as `docs/review/pr-3-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-3 onto the pr-2 branch. The operator lands it after pr-2. The owner does not merge.

## Register and log in (pr-4)

**Depends on.** pr-3.

**Files.**

- [ ] Edit `apps/api/prisma/schema.prisma` to add `User`.
- [ ] Edit `apps/api/src/server.js` to add register, login, and logout.
- [ ] Create the login page in `apps/web`.
- [ ] Create `apps/api/auth.test.js`.

**Build.**

- [ ] Add register, login, and logout in `apps/api/src/server.js`, with an httpOnly session cookie.
- [ ] Store only a salted hash of the password, made with `crypto.scrypt` from `node:crypto`. Never store or log the plain password.
- [ ] Reject a second register with an existing phone with `409`, and show `Số điện thoại đã có tài khoản.` on the card.
- [ ] Use one centered card for **Đăng nhập** and **Đăng ký**.
- [ ] Bind the anonymous cart cookie to the user at login. When that user already has a cart, merge the lines and add the quantities of a shared product.
- [ ] Keep the session after a reload.

**You see.**

- [ ] Register a new phone, reload, and still see that phone in the header.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/auth.test.js` registers a user, logs in, and expects the same user after a second login. It also expects `401` for a wrong password, `409` for a duplicate phone, and a stored password column that differs from the plain password. Run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open login on trunk and on the head. Trunk has no account. Record that, and gate a session that survives reload on the head. Save `/tmp/swarm-pr-4/worker-1/regression.png`. Pass when the head header keeps the phone after reload and trunk has no login page.
- [ ] Lane 2. Submit the login form empty. Save `/tmp/swarm-pr-4/worker-2/empty.png`. Pass when the card shows `Nhập số điện thoại và mật khẩu.`
- [ ] Lane 3. Register phone `0901234567`. Save `/tmp/swarm-pr-4/worker-3/register.png`. Pass when the header shows `0901234567`.
- [ ] Lane 4. Reload. Save `/tmp/swarm-pr-4/worker-4/reload.png`. Pass when the header still shows `0901234567`.
- [ ] Lane 5. Choose **Thoát**. Save `/tmp/swarm-pr-4/worker-5/logout.png`. Pass when the header shows **Đăng nhập**.
- [ ] Lane 6. Log in again with `0901234567` and the same password. Save `/tmp/swarm-pr-4/worker-6/login.png`. Pass when the header shows `0901234567`.
- [ ] Lane 7. Log in with a wrong password. Save `/tmp/swarm-pr-4/worker-7/wrong.png`. Pass when the card stays on screen and shows an error.
- [ ] Lane 8. Register phone `0907654321`. Save `/tmp/swarm-pr-4/worker-8/second.png`. Pass when the header shows `0907654321` and not `0901234567`.
- [ ] Lane 9. Look at the login card at 1440px width. Save `/tmp/swarm-pr-4/worker-9/card.png`. Pass when the card is centered and has no blue side panel.
- [ ] Lane 10. Add a cart line, log in, and open the cart. Save `/tmp/swarm-pr-4/worker-10/bind.png`. Pass when the line is still there and the header shows the phone.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for a login request, plus whether a second request with the session cookie returns the same phone.
- [ ] Probe. Time login on trunk and on the head, trunk first, then head, then trunk again. Trunk has no login route. Record that miss.
- [ ] Baseline. Record the trunk result first. The trunk result is that the login route is absent.
- [ ] Rule. Fail when the head login takes 1 second or longer, or when the second request does not return the same phone.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 4 screenshots into `docs/review/pr-4-review-reload.png`.
- [ ] Record a 30 to 60 second video of register, reload, logout, and login on a lane VM. Save it as `docs/review/pr-4-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-4 onto the pr-3 branch. The operator lands it after pr-3. The owner does not merge.

## Place a cash on delivery order (pr-5)

**Depends on.** pr-4.

**Files.**

- [ ] Edit `apps/api/prisma/schema.prisma` to add `Order` and `OrderLine`.
- [ ] Edit `apps/api/src/server.js` to add checkout.
- [ ] Create the checkout page in `apps/web`.
- [ ] Create `apps/api/checkout.test.js`.

**Build.**

- [ ] Require a session before checkout in `apps/api/src/server.js`.
- [ ] Create the order, its lines, and the cart clear in one Prisma transaction. Copy each product's price into `OrderLine` so a later price change leaves the order total unchanged.
- [ ] Reject checkout of an empty cart with `400`. Disable **Đặt hàng** while the request is in flight so a double click makes one order.
- [ ] Lay the address form on the left and the summary on the right at a 1440px window.
- [ ] Show **Thanh toán tiền mặt khi nhận hàng** as the only payment.

**You see.**

- [ ] Place an order and see the order id, the recipient, the address, and the total. The cart is empty. A SQL query shows one order row for that user.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/checkout.test.js` places an order and expects one order row plus an empty cart. It also expects `401` without a session and `400` for an empty cart. Run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Place an order on trunk and on the head. Trunk cannot. Record that, and gate a saved order plus an empty cart on the head. Save `/tmp/swarm-pr-5/worker-1/regression.png`. Pass when the head has one order row and trunk has no order table.
- [ ] Lane 2. Open checkout at 1440px width while logged in. Save `/tmp/swarm-pr-5/worker-2/columns.png`. Pass when the address form is on the left and the summary is on the right.
- [ ] Lane 3. Read the payment block. Save `/tmp/swarm-pr-5/worker-3/cod.png`. Pass when **Thanh toán tiền mặt khi nhận hàng** is the only payment.
- [ ] Lane 4. Submit checkout with an empty address. Save `/tmp/swarm-pr-5/worker-4/invalid.png`. Pass when the page shows `Nhập họ tên, số điện thoại, và địa chỉ.`
- [ ] Lane 5. Place an order for `Nguyễn An` at `12 Nguyễn Huệ, Quận 1`. Save `/tmp/swarm-pr-5/worker-5/done.png`. Pass when the success screen shows the order id, that name, that address, and the total.
- [ ] Lane 6. Open the cart after the order. Save `/tmp/swarm-pr-5/worker-6/empty-cart.png`. Pass when the page shows `Giỏ hàng trống`.
- [ ] Lane 7. Query Postgres for that user. Save `/tmp/swarm-pr-5/worker-7/row.png`. Pass when one order row exists and its payment is cash on delivery.
- [ ] Lane 8. Compare the order total with the cart total from before submit. Save `/tmp/swarm-pr-5/worker-8/total.png`. Pass when the two totals are equal.
- [ ] Lane 9. Choose **Mua hàng** while logged out. Save `/tmp/swarm-pr-5/worker-9/login.png`. Pass when the login card appears, and after login the order is stored for that account.
- [ ] Lane 10. Query the same order again after a reload. Save `/tmp/swarm-pr-5/worker-10/persist.png`. Pass when the row is still present.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for the checkout request, plus whether the response has an order id and the following cart read is empty.
- [ ] Probe. Time checkout on trunk and on the head, trunk first, then head, then trunk again. Trunk has no checkout route. Record that miss.
- [ ] Baseline. Record the trunk result first. The trunk result is that the checkout route is absent.
- [ ] Rule. Fail when the head checkout takes 2 seconds or longer, or when the cart still has a line.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 5 screenshots into `docs/review/pr-5-review-done.png`.
- [ ] Record a 30 to 60 second video of checkout and the empty cart on a lane VM. Save it as `docs/review/pr-5-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-5 onto the pr-4 branch. The operator lands it after pr-4. The owner does not merge.

## List the buyer's orders (pr-6)

**Depends on.** pr-5.

**Files.**

- [ ] Edit `apps/api/src/server.js` to add the order list and the single-order read.
- [ ] Create the order-list page in `apps/web`.
- [ ] Create `apps/api/orders.test.js`.

**Build.**

- [ ] Return only the session user's orders from `apps/api/src/server.js`.
- [ ] Return not-found for an order id the session user does not own.
- [ ] Show the order id, the total, and cash on delivery on the list page.

**You see.**

- [ ] The account that placed the order sees that order id. A second account does not.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/api/orders.test.js` expects the owner to see the order and the other user to get not-found. Run `npm test --prefix apps/api`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the order list on trunk and on the head. Trunk has no list. Record that, and gate owner-only rows on the head. Save `/tmp/swarm-pr-6/worker-1/regression.png`. Pass when the head list shows the buyer's order and trunk has no list page.
- [ ] Lane 2. Open the list as the buyer who placed the order. Save `/tmp/swarm-pr-6/worker-2/owner.png`. Pass when that order id is on the page.
- [ ] Lane 3. Log in as the second account and open the list. Save `/tmp/swarm-pr-6/worker-3/other.png`. Pass when that order id is absent.
- [ ] Lane 4. Read the second account's list with no orders of its own. Save `/tmp/swarm-pr-6/worker-4/empty.png`. Pass when the list is empty.
- [ ] Lane 5. Request the first account's order id as the second account. Save `/tmp/swarm-pr-6/worker-5/denied.png`. Pass when the response is not-found.
- [ ] Lane 6. Read the owner's row. Save `/tmp/swarm-pr-6/worker-6/cod.png`. Pass when the row shows the total and cash on delivery.
- [ ] Lane 7. Choose **Thoát** on the list page. Save `/tmp/swarm-pr-6/worker-7/logout.png`. Pass when the page shows **Đăng nhập**.
- [ ] Lane 8. Place a second order as the first account and open the list. Save `/tmp/swarm-pr-6/worker-8/two.png`. Pass when both order ids are visible.
- [ ] Lane 9. Read the header on the list page. Save `/tmp/swarm-pr-6/worker-9/header.png`. Pass when the header shows the logged-in phone.
- [ ] Lane 10. Reload the list. Save `/tmp/swarm-pr-6/worker-10/reload.png`. Pass when the same order ids remain.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Seconds for the order-list request, plus whether the owner sees one order and the other user sees none.
- [ ] Probe. Time the list request on trunk and on the head, trunk first, then head, then trunk again. Trunk has no list route. Record that miss.
- [ ] Baseline. Record the trunk result first. The trunk result is that the list route is absent.
- [ ] Rule. Fail when the head list takes 1 second or longer, or when the other user receives the owner's order id.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 3 screenshots into `docs/review/pr-6-review-other.png`.
- [ ] Record a 30 to 60 second video of the owner list and the second account list on a lane VM. Save it as `docs/review/pr-6-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends pr-6 onto the pr-5 branch. The operator lands it after pr-5. The owner does not merge.

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the STACK-READY report from `playbooks/autopilot-stack.md`.

## Appendix A. Prototype evidence

Layout A, B, and C were compared in an uncommitted scratch page. The folder is not a git repo, so there is no branch and no SHA.

The choice is layout A. Shots that support it are `scratch/storefront-layouts/shots/layout-a-home.png`, `scratch/storefront-layouts/shots/layout-a-product.png`, `scratch/storefront-layouts/shots/layout-a-cart.png`, `scratch/storefront-layouts/shots/layout-a-login.png`, and `scratch/storefront-layouts/shots/layout-a-checkout.png`.

On that page, search `serum` returned 1 card. **Sách** returned 2 books. A cart of quantity 2 totaled `17.980.000₫`. Empty login and empty checkout showed the validation sentences named in pr-4 and pr-5. Order `DH597797` was cash on delivery, and the cart count returned to 0. That order lived in page memory only.

These behaviors stay unproven until the PR that names them. The cart does not yet survive a reload. Register was not on the prototype. An order is not yet a Postgres row. One account cannot yet be blocked from another's orders.

## Appendix B. Alternatives rejected

Layout B lost because the banner and icon row push prices down. The buyer for this shop compares category and price on the first screen. pr-2 keeps the two buy buttons on one row. pr-4 keeps one centered login card.

Layout C lost because the home page and the search-results page were the same screen. It has no persistent category list. The later category route would have nothing of its own to reuse.

A single combined checkout-and-order-list PR lost because a buyer can place an order and still be unable to open the list. pr-5 proves the row. pr-6 proves the other account cannot see it.

Putting cart, user, and order tables into pr-1 lost because a later failure would hide inside a schema nobody had exercised. Each table arrives in the PR that first reads and writes it.

## Appendix C. Risks

`control-ui` is not installed. Live lanes still drive the browser. The owner records the IDE browser fallback until `cursor-team-kit` provides `control-ui`. This risk starts at pr-2.

The repo has no git remote and no `HEAD` yet. pr-1 creates the local repository. `git show origin/main:...` fails until a remote exists. The arm step records that fallback.

The anonymous cart cookie in pr-3 must still be the same cart after login in pr-4. pr-4 lane 10 watches that bind. A new empty cart on login is a failure.

Every `npm test --prefix apps/api` run reads and writes Postgres. The owner starts `docker compose up -d` first and resets test rows between cases, or a leftover cart or order fails the next test. This risk starts at pr-1.

The web and the API run on different ports. pr-2 puts the API behind the Next.js `/api` rewrite so the cookies stay on port `3000`. A browser call straight to port `4000` would drop the cart and the session. pr-3 lane 4 and pr-4 lane 4 watch for that loss.

Checkout in the prototype did not require login. pr-5 does, because pr-6 has to hide the order from other accounts. pr-5 lane 9 watches the redirect to login.

## Appendix D. Links and reading list

Read `docs/xay-clone-tiki.md` before editing. Read `scratch/storefront-layouts/store.js` for the 16 seed products. Read the layout A shots named in Appendix A before changing `apps/web`.

pr-2 and pr-5 read `pstack/skills/how/SKILL.md` before coding, because each one crosses the web and API boundary. `pstack/skills/interrogate/SKILL.md` stays unused unless a PR changes the layout A contract.

Keep the decision trail local, per `pstack/skills/show-me-your-work/SKILL.md`. This plan is the record until an owner commits code.
