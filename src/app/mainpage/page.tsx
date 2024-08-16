import React from "react";
import Mainpage from "../../../components/mainpage"; 

const MainpageContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-4 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-primary-foreground">
          Polls and Opinions
        </h1>
      </header>
      <main className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <Mainpage />
      </main>
      <footer className="bg-secondary py-4 px-4 md:px-6 lg:px-8 text-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainpageContent;
