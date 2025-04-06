"use client";
import React from "react";
import Form from "next/form";
import { useActionState, useState } from "react";
import { parseServerActionResponse } from "@/lib/utils";
import { inputSchema } from "@/lib/validation";
import { z } from "zod";
import { ActionState } from "@/lib/GlobalTypes";
import { toast } from "sonner";
import { recommendPlayers } from "@/lib/actions";
import ViewResults from "./ViewResults";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const ReviewForm = () => {
  const router = useRouter();
  const [budgetInputValue, setBudgetInputValue] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [results, setResults] = useState<any>(null);
  const [viewResults, setViewResults] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResetFields = () => {
    setBudgetInputValue("");
    setHeightInput("");
    setAgeInput("");
    setPositionInput("");
    setErrors({});
    setResults(null);
    setFormKey((prev) => prev + 1);
    router.refresh();
  };

  const handleFormSubmit = async (
    prevState: ActionState,
    formData: FormData
  ) => {
    // Handle form submission logic here
    console.log("resubmitting...");
    const getBudget = formData.get("budget") as string;
    const getHeight = formData.get("height") as string;
    const getAge = formData.get("age") as string;
    const getPosition = positionInput;
    console.log("get psosition", getPosition);
    try {
      const budget = parseInt(getBudget);
      const height = parseInt(getHeight);
      const age = parseInt(getAge);
      const position = getPosition.toLowerCase();

      const data = {
        budget: budget,
        height: height,
        age: age,
        position: position,
      };

      await inputSchema.parseAsync(data);

      const result = await recommendPlayers(data);
      console.log("result", result);

      if (result.status === "SUCCESS") {
        setResults(result.data);
        toast.success("Success", {
          description: "Form submitted successfully",
        });
        return parseServerActionResponse({
          status: "SUCCESS",
          data: result.data,
        });
      } else {
        toast.error("Error", {
          description: "Failed to fetch data",
        });
        return parseServerActionResponse({
          status: "ERROR",
          error: result.error,
        });
      }
    } catch (errors) {
      console.error("Error submitting form:", errors);
      if (errors instanceof z.ZodError) {
        const fieldErrors = errors.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Error", {
          description: "Please check your inputs",
        });
        return { ...prevState, error: "Validation Failed", status: "ERROR" };
      } else {
        console.error("Error submitting form:", errors);
        toast.error("Error", {
          description: "Unexpected error. Please try again later",
        });
        return parseServerActionResponse({
          status: "ERROR",
          error: "Unexpected error",
        });
      }
    }
  };
  const [_state, formAction, isPending] = useActionState(handleFormSubmit, {
    status: "INITIAL",
    error: "",
  });
  return (
    <div className="flex flex-col gap-5 text-3xl text-black pt-5 border-[1px] border-[#dbdbdb] p-5 rounded-md shadow-md min-w-[200px] max-w-[350px] w-full">
      <p className="text-black text-[18px] sm:text-[20px]">Submit a request</p>
      <Form key={formKey} action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col w-full h-auto gap-3">
          <p className="text-black text-[14px] sm:text-[16px]">
            Please select your max budget in US dollars
          </p>
          <input
            className="w-full bg-transparent border-[1px] border-[#dbdbdb] rounded-[5px] h-full px-2 text-black text-[10px] sm:text-[12px] min-h-[40px] focus:outline-none"
            placeholder="Enter your budget"
            value={budgetInputValue}
            onChange={(e) => setBudgetInputValue(e.target.value)}
            disabled={isPending}
            name="budget"
          ></input>
          {errors.budget && (
            <p className="text-[#D60244] text-[10px] sm:text-[12px]">
              Please enter a number between 1 to 1 billion
            </p>
          )}
        </div>

        <div className="flex flex-col w-full h-auto gap-3">
          <p className="text-black text-[14px] sm:text-[16px]">
            Please select your min height in inches
          </p>
          <input
            className="w-full bg-transparent border-[1px] border-[#dbdbdb] rounded-[5px] h-full px-2 text-black text-[10px] sm:text-[12px] min-h-[40px] focus:outline-none"
            placeholder="Enter min height in inches"
            value={heightInput}
            onChange={(e) => setHeightInput(e.target.value)}
            disabled={isPending}
            name="height"
          ></input>
          {errors.height && (
            <p className="text-[#D60244] text-[10px] sm:text-[12px]">
              Please enter a height between 0 to 100 inches
            </p>
          )}
        </div>

        <div className="flex flex-col w-full h-auto gap-3">
          <p className="text-black text-[14px] sm:text-[16px]">
            Please select a max age
          </p>
          <input
            className="w-full bg-transparent border-[1px] border-[#dbdbdb] rounded-[5px] h-full px-2 text-black text-[10px] sm:text-[12px] min-h-[40px] focus:outline-none"
            placeholder="Enter max age as a raw number"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            disabled={isPending}
            name="age"
          ></input>
          {errors.age && (
            <p className="text-[#D60244] text-[10px] sm:text-[12px]">
              Please enter an age between 18 to 80
            </p>
          )}
        </div>
        <div className="flex flex-col w-full h-auto gap-3">
          <p className="text-black text-[14px] sm:text-[16px]">
            Please enter position. eg: Forward, Center-Forward
          </p>
          <input
            className="w-full bg-transparent border-[1px] border-[#dbdbdb] rounded-[5px] h-full px-2 text-black text-[10px] sm:text-[12px] min-h-[40px] focus:outline-none"
            placeholder="Enter a position"
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            disabled={isPending}
            name="position"
          ></input>
          {errors.position && (
            <p className="text-[#D60244] text-[10px] sm:text-[12px] text-wrap">
              Please enter a valid position. "Center", "Forward", "Guard",
              "Center-Forward", "Forward-Center", "Forward-Guard",
              "Guard-Forward";
            </p>
          )}
        </div>
        {results && (
          <>
            <p
              className="w-full text-center px-4 py-3 text-semibold text-[16px] sm:text-[18px] text-white transition duration-200 ease-in-out sm:hover:scale-105 active:opacity-70 bg-[#1A7122] rounded-sm"
              onClick={() => setViewResults((prev) => !prev)}
            >
              View your Results!
            </p>
            <ViewResults
              results={results}
              viewResults={viewResults}
              setViewResults={setViewResults}
            />
          </>
        )}
        <button
          className="w-full px-4 py-3 text-semibold text-[16px] sm:text-[18px] text-white transition duration-200 ease-in-out sm:hover:scale-105 active:opacity-70 bg-[#5B7192] rounded-sm"
          type="submit"
        >
          Submit
        </button>
        <button
          className="w-full px-4 py-3 text-semibold text-[16px] sm:text-[18px] text-white transition duration-200 ease-in-out sm:hover:scale-105 active:opacity-70 bg-[#925B6C] rounded-md"
          onClick={handleResetFields}
          type="button"
        >
          Reset Fields
        </button>
      </Form>
    </div>
  );
};

export default ReviewForm;
