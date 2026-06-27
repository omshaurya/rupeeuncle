import CalculatorCard from "../calculators/CalculatorCard";

interface Props {
  calculators: { slug: string; name: string; shortDescription: string; icon?: string }[];
}

export default function RelatedCalculators({ calculators }: Props) {
  if (calculators.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
        Related Calculators
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <CalculatorCard
            key={calc.slug}
            slug={calc.slug}
            name={calc.name}
            shortDescription={calc.shortDescription}
            icon={calc.icon}
          />
        ))}
      </div>
    </section>
  );
}
