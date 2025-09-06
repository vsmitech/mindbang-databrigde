
import SessionMenu from "./SessionMenu";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-50 p-1 pl-4 text-black z-10 flex justify-between items-center">
      <h1 className="text-xl font-bold">MINDBANG SUITE</h1>      
       <SessionMenu />
    </header>
  );
}
