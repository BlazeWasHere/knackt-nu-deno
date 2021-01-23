# knackt.nu library

## **Setup**
### taken from [usage.js](https://github.com/BlazeWasHere/knackt-nu-deno/usage.ts)

```js
import { Knackt } from "./mod.ts";


const token = "token";
let knackt = new Knackt(token);

const categories = await knackt.categories();
const file = "test.txt";

for (let category of categories) {
  const combos = await knackt.category_created(category.created);

  if (!("error" in combos)) {
    for (let combo of combos) {
      if (!combo.downloaded) {
        await knackt.download(file, combo.hash, combo.name, true);
        console.log(`Downloaded ${combo.name} to ${file}`);
      }
    }
  }
}
```