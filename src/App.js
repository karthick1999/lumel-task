import './App.css'; 
import  React ,{ useState } from 'react';

const initialJsonInput = [
    {
        "id": "electronics",
        "label": "Electronics",
        "children": [
            { "id": "phones", "label": "Phones", "value": 800 },
            { "id": "laptops", "label": "Laptops", "value": 700 }
        ]
    },
    {
        "id": "furniture",
        "label": "Furniture",
        "children": [
            { "id": "tables", "label": "Tables", "value": 300 },
            { "id": "chairs", "label": "Chairs", "value": 700 }
        ]
    }
];

const calculateParentValues = (data) =>
    data.map(item => ({
        ...item,
        value: item.children.reduce((sum, child) => sum + child.value, 0)
    }));

function App() {
    const [data, setData] = useState(calculateParentValues(initialJsonInput));

    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        const isParent = name.startsWith('parent');
        const id = name.split('-')[1];

        setData(prevData =>
            prevData.map(item => {
                if (isParent && item.id === id) {
                    return { ...item, userValue: parseFloat(value) || '' };
                } else if (!isParent) {
                    return {
                        ...item,
                        children: item.children.map(child =>
                            child.id === id ? { ...child, userValue: parseFloat(value) || '' } : child
                        )
                    };
                }
                return item;
            })
        );
    };

    const handleAllocationVal = (id, isParent) => {
      setData(prevData =>
          prevData.map(item => {
              if (isParent && item.id === id && item.userValue) {
                  const newParentValue = parseFloat(item.userValue);
                  const originalParentValue = item.value;
  
                  const children = item.children.map(child => {
                      const childContribution = child.value / originalParentValue;
                      const newChildValue = childContribution * newParentValue;
                      const childVariance = ((newChildValue - child.value) / child.value * 100).toFixed(2);
                      return { ...child, value: newChildValue, varience: `${childVariance}%` };
                  });
  
                  const parentVariance = ((newParentValue - originalParentValue) / originalParentValue * 100).toFixed(2);
                  return { ...item, value: newParentValue, children, varience: `${parentVariance}%` };
              } else if (!isParent) {
                  const updatedChildren = item.children.map(child => {
                      if (child.id === id && child.userValue) {
                          const newChildValue = parseFloat(child.userValue);
                          const childVariance = ((newChildValue - child.value) / child.value * 100).toFixed(2);
                          return { ...child, value: newChildValue, varience: `${childVariance}%` };
                      }
                      return child;
                  });
  
                  const newParentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                  const parentVariance = ((newParentValue - item.value) / item.value * 100).toFixed(2);
  
                  return { ...item, children: updatedChildren, value: newParentValue, varience: `${parentVariance}%` };
              }
              return item;
          })
      );
  };
  

    const handleAllocationPercent = (id, isParent) => {
      setData(prevData =>
          prevData.map(item => {
              if (isParent && item.id === id && item.userValue) {
                  const parentValue = item.value;
                  const percentageIncrease = parseFloat(item.userValue) / 100;
                  const newParentValue = parentValue + parentValue * percentageIncrease;
  
                  const children = item.children.map(child => {
                      const newChildValue = child.value + (child.value * percentageIncrease);
                      const variance = ((newChildValue - child.value) / child.value * 100).toFixed(2);
                      return {
                          ...child,
                          value: newChildValue,
                          varience: `${variance}%`
                      };
                  });
  
                  const variance = ((newParentValue - parentValue) / parentValue * 100).toFixed(2);
                  return { ...item, value: newParentValue, children, varience: `${variance}%` };
              } else if (!isParent) {
                  const updatedChildren = item.children.map(child => {
                      if (child.id === id && child.userValue) {
                          const oldValue = child.value;
                          const percentageIncrease = parseFloat(child.userValue) / 100;
                          const newValue = oldValue + oldValue * percentageIncrease;
                          const variance = ((newValue - oldValue) / oldValue * 100).toFixed(2);
                          return { ...child, value: newValue, varience: `${variance}%` };
                      }
                      return child;
                  });
  
                  const newParentValue = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                  const parentVariance = ((newParentValue - item.value) / item.value * 100).toFixed(2);
  
                  return { ...item, children: updatedChildren, value: newParentValue, varience: `${parentVariance}%` };
              }
              return item;
          })
      );
  };
  
  
    return (
        <div className="App">
            <table className="table">
                <thead className='thead-light'>
                    <tr>
                        <th scope="col">Label</th>
                        <th scope="col">Value</th>
                        <th scope="col">Input</th>
                        <th scope="col">Allocation %</th>
                        <th scope="col">Allocation val</th>
                        <th scope="col">Variance %</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <th scope="row">{item.label}</th>
                                <td>{item.value}</td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="enter input"
                                        name={`parent-${item.id}`}
                                        value={item.userValue ?? ''}
                                        onChange={handleChangeInput}
                                    />
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleAllocationPercent(item.id, true)}>
                                        Allocation %
                                    </button>
                                </td>
                                <td>
                                    <button type="button" className="btn btn-primary" onClick={() => handleAllocationVal(item.id, true)}>
                                        Allocation value
                                    </button>
                                </td>
                                <td>{item.varience ?? '0%'}</td>
                            </tr>
                            {item.children.map(citem => (
                                <tr key={citem.id}>
                                    <th scope="row">{"..."} {citem.label}</th>
                                    <td>{citem.value}</td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="enter input"
                                            name={`children-${citem.id}`}
                                            value={citem.userValue ?? ''}
                                            onChange={handleChangeInput}
                                        />
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-primary" onClick={() => handleAllocationPercent(citem.id, false)}>
                                            Allocation %
                                        </button>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-primary" onClick={() => handleAllocationVal(citem.id, false)}>
                                            Allocation value
                                        </button>
                                    </td>
                                    <td>{citem.varience ?? '0%'}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
