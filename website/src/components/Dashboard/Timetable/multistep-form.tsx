"use client"
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/clientApp";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { addTimetable } from "@/lib/firebase/firestore";
import { FormStep, FormStep0 } from "./form-steps";

export function MultiStepForm({ steps }: { steps: number }) {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [totalSteps, setTotalSteps] = React.useState(steps);
    const initial: Timetable = {
        id: nanoid(5),
        semester: "",
        noOfWorkingDays: totalSteps,
        courses: [],
    }
    const [timetableDetails, setTimetableDetails] = React.useState(initial);

    const [user] = useAuthState(auth);
    if (!user) {
        console.error("User is not authenticated. Redirecting to login...");
        return;
    }

    const nextStep = async () => {
        if (currentStep < totalSteps) {
            setTotalSteps(Number(timetableDetails.noOfWorkingDays) + 1);
            setCurrentStep(currentStep + 1);
        } else {
            const res = await addTimetable(user, timetableDetails);
            if (res.success) {
                resetForm();
                alert("Timetale added successfully");
            }
            else {
                alert("Error adding / updating timetable");
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };


    const resetForm = () => {
        setTimetableDetails(initial);
        setCurrentStep(0);
    };

    const renderForm = () => {
        if (currentStep == 0)
            return <FormStep0 timetable={timetableDetails} setTimetable={setTimetableDetails} nextStep={nextStep} />;
        else if(currentStep == totalSteps) 
            return <h2>Review and Submit</h2>
        else
            return <FormStep k={currentStep} />
    };

    const progressBar = () => {
        const dots = [] as React.JSX.Element[];
        for (let i = 0; i < totalSteps; i++) {
            dots.push(
                <span key={i} className={`h-3 w-3 rounded-full ${currentStep > i ? "bg-black" : "bg-primary/30"}`}></span>
            );
        }
        return dots;
    };

    return (
        <div className="container mx-auto px-4 md:px-0">
            {currentStep > 0 && <div className="h-1 w-full flex justify-between">
                <div></div>
                {progressBar()}
            </div>}
            {currentStep > 0 && <Progress value={(currentStep / totalSteps) * 100} className="mb-4 h-1" />}

            {renderForm()}
            <div className="flex justify-between mt-4">
                <Button onClick={prevStep} disabled={currentStep === 0}>
                    Previous
                </Button>
                <Button onClick={nextStep} disabled={currentStep === totalSteps + 1}>
                    {currentStep === totalSteps ? "Submit" : "Next"}
                </Button>
            </div>
        </div>
    );
}