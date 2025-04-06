import Image from "next/image";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] bg-[#F2F4F7] p-3">
<<<<<<< HEAD
      <Image
        src="/assets/lebron.jpg"
        alt="LeBron James"
        width={300}
        height={400}
        className="mb-4 rounded-lg shadow-lg"
      />
=======
>>>>>>> 88a42c45be5e04e315697577532875776fa59c9a
      <HomeContent />
      <img src={"/assets/Basketball.png"} alt="A nice image" />
    </div>
  );
}
