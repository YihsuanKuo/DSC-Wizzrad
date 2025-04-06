import Image from "next/image";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="flex flex-row justify-between justify-center items-center h-[calc(100vh-4rem)] bg-[#F2F4F7] p-3 pl-[15%] pr-[15%]" >
      <div className="relative  h-[200px] w-[300px] sm:h-[300px] sm:w-[500px]">
      <Image
        src="/assets/lebron.jpg"
        alt="LeBron James"
        fill
        className="mb-4 rounded-lg shadow-lg object-cover"
      />
      </div>
      <HomeContent />
      <div className="">
      <img src={"/assets/Basketball.png"} alt="A nice image" />
      </div>
    </div>
  );
}
