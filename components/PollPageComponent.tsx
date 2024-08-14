'use client';

import styles from './PollPage.module.css';

interface Poll {
  title: string;
  question: string;
}

interface CategorySectionProps {
  category: string;
  polls: Poll[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, polls }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{category}</h2>
      <ul className="space-y-4">
        {polls.map((poll, index) => (
          <li key={index} className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-medium">{poll.title}</h3>
            <p className="text-gray-600">{poll.question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default function PollPageComponent() {
  return (
    <div className={`${styles.pollPage} container mx-auto py-12 px-4 md:px-6 lg:px-8`}>
      <div className="space-y-6">
        <CategorySection
          category="Politics"
          polls={[
            {
              title: "Should the voting age be lowered to 16?",
              question: "There's been a lot of debate around lowering the voting age. What do you think?",
            },
            {
              title: "Should there be term limits for members of parliament?",
              question: "Should there be limits on the number of terms a member of parliament can serve?",
            },
          ]}
        />
        <CategorySection
          category="Technology"
          polls={[
            {
              title: "Are we ready for AI in daily life?",
              question: "AI is becoming more integrated into daily life. Are we ready for the changes?",
            },
            {
              title: "Should social media be regulated more strictly?",
              question: "There's growing concern about the impact of social media. Should it be regulated more strictly?",
            },
          ]}
        />
      </div>
    </div>
  );
}
