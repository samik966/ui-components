import { useState } from "react";
import { BiUser } from "react-icons/bi";
import CustomSelect from "./custom-select";

// type Data = { key: string; label: string };

function App() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // const _options: Data[] = [
    //     { key: "Something1", label: "Something 1" },
    //     { key: "Something2", label: "Something 2" },
    //     { key: "Something3", label: "Something 3" },
    // ];
    const options2: string[] = ["Something 1", "Something 2", "Something 3"];

    const handleSelect = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <div>
            <h1 className="text-4xl">UI Components</h1>
            <div className="px-4">
                <CustomSelect
                    options={options2}
                    // valueKey="key"
                    // labelKey="label"
                    value={selectedOption}
                    onSelect={handleSelect}
                    activeClassName="bg-red-300"
                    selectClassName="border-red-400 focus-visible:outline-red-300"
                    optionClassName="hover:bg-red-200"
                    renderOption={(option) => (
                        <div className="flex items-center gap-2">
                            <BiUser />
                            {option}
                        </div>
                    )}
                />
            </div>
            <p>Selected Option: {selectedOption}</p>
        </div>
    );
}

export default App;
