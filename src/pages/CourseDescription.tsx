import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface CourseDetails {
  courseId: string;
  title: string;
  overview: string;
  curriculum: string;
  duration: string;
  imageUrl: string;
  instructor: string;
  prerequisites: string;
}

const CourseDescription: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUWJtv7MNdcVqSoPoWsFlSz9Dco0TIcYXOW5yOnPx1e-kkOCmig8hsng9DLZJMeaJwhwFOwCs9uptq/pub?output=csv"
    )
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const allCourses = results.data as CourseDetails[];
            const selectedCourse = allCourses.find(
              (c) => c.courseId?.trim() === courseId
            );
            if (selectedCourse) {
              setCourse(selectedCourse);
            } else {
              toast({
                title: "Course Not Found",
                description: "We couldn't find details for this course.",
                variant: "destructive",
              });
            }
            setLoading(false);
          },
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not load course details.",
          variant: "destructive",
        });
        setLoading(false);
      });
  }, [courseId]);

  const handleStartCourse = () => {
    if (course) {
      navigate(`/learning/${course.courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <p className="text-red-500">No course details available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Course Title */}
      <h1 className="text-3xl font-bold">{course.title}</h1>

      {/* Course Image */}
      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.title}
          className="rounded-lg shadow-lg max-h-96 w-full object-cover"
        />
      )}

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.overview}</p>
        </CardContent>
      </Card>

      {/* Curriculum */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.curriculum}</p>
        </CardContent>
      </Card>

      {/* Duration */}
      <Card>
        <CardHeader>
          <CardTitle>Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.duration}</p>
        </CardContent>
      </Card>

      {/* Instructor */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.instructor}</p>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{course.prerequisites}</p>
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="flex justify-end">
        <Button onClick={() => navigate(`/course/${courseId}/chapters`)}>
          Start Course
        </Button>
      </div>
    </div>
  );
};

export default CourseDescription;
