export default function PropertyComparison() {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  
  const compareFeatures = [
    'price',
    'bedrooms',
    'bathrooms',
    'squareFeet',
    'location',
    'propertyType',
    'yearBuilt'
  ];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left">Features</th>
            {selectedProperties.map(propId => (
              <th key={propId} className="px-6 py-3 bg-gray-50">
                Property {propId}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {compareFeatures.map(feature => (
            <tr key={feature}>
              <td className="px-6 py-4 whitespace-nowrap">{feature}</td>
              {selectedProperties.map(propId => (
                <td key={`${propId}-${feature}`} className="px-6 py-4">
                  {/* Feature value */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}