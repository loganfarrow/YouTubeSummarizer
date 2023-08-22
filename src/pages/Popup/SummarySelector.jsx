import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { generateSummary, deleteSummary, fetchSummaries, fetchSummary, findSummary } from '../../../utils/summaryCalls'

function SummarySelector({ jwtToken }) {
  const mostRecent = true; // Replace this if needed

  const { data, isLoading, error } = useQuery('summaries', () => fetchSummaries(jwtToken, mostRecent).then(res => res.data));

  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleSelectionChange = (e) => {
    const selectedTitle = e.target.value;
    const summary = data.find(summary => summary.titles.includes(selectedTitle));
    setSelectedSummary(summary);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const allTitles = data.flatMap(summary => summary.titles);

  return (
    <div>
      <label htmlFor="summarySelector">Select a title:</label>
      <select id="summarySelector" onChange={handleSelectionChange}>
        <option value="">Select...</option>
        {allTitles.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
        ))}
      </select>

      {selectedSummary && (
        <div>
          <label htmlFor="summaryText">Summary:</label>
          <textarea id="summaryText" readOnly value={selectedSummary.text} />
        </div>
      )}
    </div>
  );
}

export default SummarySelector;
