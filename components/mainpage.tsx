import React from "react";
import Button from "./button";

export default function Mainpage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Politics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should the voting age be lowered to 16?
              </h3>
              <p className="text-muted-foreground mb-4">
                There has been a lot of debate around lowering the voting age.
                What do you think?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should term limits be implemented for Congress?
              </h3>
              <p className="text-muted-foreground mb-4">
                Some argue that term limits could help reduce career
                politicians. What is your view?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should the Electoral College be abolished?
              </h3>
              <p className="text-muted-foreground mb-4">
                The Electoral College has been a contentious topic. Do you think
                it should be abolished?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should the minimum wage be increased?
              </h3>
              <p className="text-muted-foreground mb-4">
                There has been a lot of debate around raising the minimum wage.
                What is your stance?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should the government provide universal healthcare?
              </h3>
              <p className="text-muted-foreground mb-4">
                Many countries have universal healthcare. Should the US
                implement it?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Entertainment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Who should win Best Picture at the Oscars?
              </h3>
              <p className="text-muted-foreground mb-4">
                There are a lot of great films nominated this year. Which one do
                you think should win?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Film A</Button>
                <Button variant="outline">Film B</Button>
                <Button variant="outline">Film C</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Which streaming service has the best original content?
              </h3>
              <p className="text-muted-foreground mb-4">
                With so many streaming options, which one do you think has the
                best original shows and movies?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Netflix</Button>
                <Button variant="outline">Hulu</Button>
                <Button variant="outline">Disney+</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Who should be the next James Bond?
              </h3>
              <p className="text-muted-foreground mb-4">
                Now that Daniel Craig has stepped down, who do you think should
                take over the role of 007?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Actor A</Button>
                <Button variant="outline">Actor B</Button>
                <Button variant="outline">Actor C</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Which new album are you most excited for?
              </h3>
              <p className="text-muted-foreground mb-4">
                There are a lot of highly anticipated album releases coming up.
                Which one are you looking forward to the most?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Album A</Button>
                <Button variant="outline">Album B</Button>
                <Button variant="outline">Album C</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Who should host the next Oscars ceremony?
              </h3>
              <p className="text-muted-foreground mb-4">
                The Oscars have had a hard time finding a consistent host in
                recent years. Who do you think should take on the role?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Host A</Button>
                <Button variant="outline">Host B</Button>
                <Button variant="outline">Host C</Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should social media platforms be more regulated?
              </h3>
              <p className="text-muted-foreground mb-4">
                There has been a lot of debate around the role of social media
                and whether it needs more oversight.
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should self-driving cars be allowed on public roads?
              </h3>
              <p className="text-muted-foreground mb-4">
                As autonomous vehicle technology advances, There has a debate
                around their safety and regulation.
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should companies be allowed to use facial recognition?
              </h3>
              <p className="text-muted-foreground mb-4">
                Facial recognition technology raises privacy concerns. Should it
                be more restricted?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should the government invest more in renewable energy?
              </h3>
              <p className="text-muted-foreground mb-4">
                Transitioning to renewable energy sources is seen as crucial for
                addressing climate change.
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">
                Should tech companies be required to disclose data breaches?
              </h3>
              <p className="text-muted-foreground mb-4">
                Transparency around data breaches is crucial for user trust.
                Should companies be mandated to disclose breaches?
              </p>
              <div className="flex items-center justify-between">
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
