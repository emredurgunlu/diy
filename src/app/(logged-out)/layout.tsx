import { redirect } from "next/navigation";
import { auth } from "../../../auth";


//  Bu kısım protected route için. Yani user log in olmuşsa ve browserdan /login veya /register sayfasına gitmeye çalışıyorsa bu sayfalar yerine zaten log in olduğu için /my-account sayfasına yönlendirecek
export default async function LoggedOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log({ session });
  // (Kodların ilk halinde) konsola bunları yazdırıyordu:
  // session: {
  //   user: { email: 'demo@gmail.com' },
  //   expires: '2025-05-07T04:54:31.209Z'
  // }
  // Bu nedenle bu şekilde yaparsak my-account sayfasına yönlendirmez çünkü sessionda id yok:
  //   if (!!session?.user?.id) { redirect("/my-account"); }
  // Bunun yerine if (!!session?.user?.email) { redirect("/my-account"); } yaparsak my-account sayfasına yönlendirir fakat bu şekilde yapmıyoruz çünkü
  // we actually store the ID as part of the JWT token, which handles the user's logged in session.
  // So to do this, we want to open up our auth.ts file, which is in the root directory of our project,
  // and we want to scroll all the way to the top here.
  // And as well as providers in the next auth configuration we need to add some callback functions.
  // auth.ts dosyasına call back fonksyonu ekledikten sonra artık konsola bu yazıyor:
  // session: {
  //   user: { email: 'demo@gmail.com', id: '5' },
  //   expires: '2025-05-07T05:13:01.366Z'
  // } ve /my-account sayfasında iken browserdan /login sayfasını yazdığımızda yine de /my-account sayfasına yönlendiriyor.
  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return children;
}