interface TestCaseResultsProps {
  testCases: string[];
}

export default function TestCaseResults({
  testCases,
}: TestCaseResultsProps) {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Generated Test Cases
      </h3>

      {testCases.map((testCase, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-xl border p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold">
              Test Case Result
            </h4>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              AI Generated
            </span>
          </div>

          <pre className="whitespace-pre-wrap text-sm leading-7 overflow-x-auto">
            {testCase}
          </pre>
        </div>
      ))}
    </div>
  );
}