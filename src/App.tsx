import { useState } from "react";
import { BiUser } from "react-icons/bi";
import AutoComplete from "./autocomplete";
import CustomSelect from "./custom-select";

type Data = { value: string; label: string };

// const options1: string[] = ["Something 1", "Something 2", "Something 3"];

const options2: Data[] = [
    { value: "Something1", label: "Something 1" },
    { value: "Something2", label: "Something 2" },
    { value: "Something3", label: "Something 3" },
];
function App() {
    const [selectedOption, setSelectedOption] = useState<Data | null>(null);
    const [autocompleteValue, setAutoCompleteValue] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<Data[]>([]);

    const handleSelect = (option: Data | Data[]) => {
        if (Array.isArray(option)) {
            setSelectedOptions(option);
        } else {
            setSelectedOption(option);
        }
    };

    const handleChange = (newValue: string) => {
        setAutoCompleteValue(newValue);
    };

    return (
        <div>
            <h1 className="text-4xl">UI Components</h1>
            <div className="container mx-auto my-4">
                <div className="flex gap-4 border p-4">
                    <CustomSelect
                        options={options2}
                        labelKey="label"
                        valueKey="value"
                        value={selectedOption}
                        onSelect={handleSelect}
                        renderOption={(option) => {
                            return (
                                <div className="flex items-center gap-1">
                                    <BiUser />
                                    {option.label}
                                </div>
                            );
                        }}
                    />
                    <AutoComplete
                        multiple={true}
                        labelKey="label"
                        valueKey="value"
                        // limitPill={1}
                        value={autocompleteValue}
                        options={options2}
                        selectedOptions={selectedOptions}
                        onChange={handleChange}
                        onSelect={handleSelect}
                        tagClassName="bg-rose-400 text-white"
                        containerClassName="border-rose-100 focus-within:ring-rose-300 focus-visible:outline-rose-200"
                        optionClassName="hover:bg-rose-100"
                        activeClassName="bg-rose-300"
                        renderOption={(option) => {
                            return (
                                <div className="flex items-center gap-1">
                                    <BiUser />
                                    {option.label}
                                </div>
                            );
                        }}
                        renderNoOption={() => <div>No Type Found</div>}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
