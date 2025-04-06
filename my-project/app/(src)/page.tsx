import Image from "next/image";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] bg-[#F2F4F7] p-3">
      <Image
        src="/assets/lebron.jpg"
        alt="LeBron James"
        width={300}
        height={400}
        className="mb-4 rounded-lg shadow-lg"
      />
      <HomeContent />
    </div>
  );
}
