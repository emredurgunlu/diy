This is a [Next.js](https://nextjs.org) project



Firstly install [Node js](https://nodejs.org/en) Then 
```bash
npm i
```
and
```bash
npm run dev
```
npx drizzle-kit push (to create table on neon)

Bu projede Next.js 15 ve Tailwind CSS v4 kullanıldığından artık tailwind.config.js dosyasına gerek yoktur.
Veritabanı işlemleri için @neondatabase/serverless ve drizzle-orm yüklenmiştir.
Komponent library olarak shadcn@latest yüklenmiştir. 
Stillendirmeler shadcn ve Tailwind CSS ile yapılabilir, ekstradan css dosyası oluşturmaya gerek yoktur.
src/app klasörü içindeki (logged-out) klasörü kullanıcının henüz log in olmadan görüntüleyebildiği sayfa ve componentleri barındırır. Eğer klasörün içinde page.tsx varsa bu bir sayfadır, eğer klasörün içinde page.tsx yoksa ama index.tsx varsa bu bir komponenttir.
src/app klasörü içindeki (logged-in) klasörü ise kullanıcının log in olduktan sonra görüntüleyebildiği sayfa ve componentleri barındırır.