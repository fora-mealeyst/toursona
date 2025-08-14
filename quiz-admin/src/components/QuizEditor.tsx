import React, { useState, useEffect } from 'react';
import { IQuiz, IStep, IInput, CreateQuizRequest } from '../types';

interface QuizEditorProps {
  quiz?: IQuiz | null;
  onSave: (quizData: CreateQuizRequest) => void;
  onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onSave, onCancel }) => {
  const [title, setTitle] = useState(quiz?.title || '');
  const [steps, setSteps] = useState<IStep[]>(quiz?.steps || []);

  const addStep = () => {
    const newStep: IStep = {
      title: `Step ${steps.length + 1}`,
      inputs: []
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepIndex: number) => {
    setSteps(steps.filter((_, index) => index !== stepIndex));
  };

  const updateStepTitle = (stepIndex: number, title: string) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].title = title;
    setSteps(updatedSteps);
  };

  const addInput = (stepIndex: number) => {
    const updatedSteps = [...steps];
    const newInput: IInput = {
      label: 'New Input',
      type: 'text',
      name: `input_${Date.now()}`,
      required: false
    };
    updatedSteps[stepIndex].inputs.push(newInput);
    setSteps(updatedSteps);
  };

  const removeInput = (stepIndex: number, inputIndex: number) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].inputs.splice(inputIndex, 1);
    setSteps(updatedSteps);
  };

  const updateInput = (stepIndex: number, inputIndex: number, field: keyof IInput, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].inputs[inputIndex] = {
      ...updatedSteps[stepIndex].inputs[inputIndex],
      [field]: value
    };
    setSteps(updatedSteps);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }
    if (steps.length === 0) {
      alert('Please add at least one step');
      return;
    }
    
    const quizData: CreateQuizRequest = {
      title: title.trim(),
      steps: steps
    };
    onSave(quizData);
  };

  const inputTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'select', label: 'Dropdown' },
    { value: 'number', label: 'Number Input' },
    { value: 'email', label: 'Email Input' },
    { value: 'url', label: 'URL Input' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {quiz ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <div className="space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {quiz ? 'Update Quiz' : 'Create Quiz'}
          </button>
        </div>
      </div>

      {/* Quiz Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quiz Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quiz title..."
        />
      </div>

      {/* Steps */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Steps</h3>
          <button
            onClick={addStep}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            + Add Step
          </button>
        </div>

        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={step.title}
                onChange={(e) => updateStepTitle(stepIndex, e.target.value)}
                className="text-lg font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Step title..."
              />
              <button
                onClick={() => removeStep(stepIndex)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Step
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-700">Inputs</h4>
                <button
                  onClick={() => addInput(stepIndex)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  + Add Input
                </button>
              </div>

              {step.inputs.map((input, inputIndex) => (
                <div key={inputIndex} className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={input.label}
                        onChange={(e) => updateInput(stepIndex, inputIndex, 'label', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Input label..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={input.type}
                        onChange={(e) => updateInput(stepIndex, inputIndex, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {inputTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name (Field ID)
                      </label>
                      <input
                        type="text"
                        value={input.name}
                        onChange={(e) => updateInput(stepIndex, inputIndex, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="field_name..."
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={input.required}
                          onChange={(e) => updateInput(stepIndex, inputIndex, 'required', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>

                  {/* Options for radio, checkbox, and select inputs */}
                  {(input.type === 'radio' || input.type === 'checkbox' || input.type === 'select') && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (one per line)
                      </label>
                      <textarea
                        value={input.options?.join('\n') || ''}
                        onChange={(e) => updateInput(stepIndex, inputIndex, 'options', e.target.value.split('\n').filter(opt => opt.trim()))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        rows={3}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => removeInput(stepIndex, inputIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove Input
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {steps.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No steps added yet. Click "Add Step" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default QuizEditor;
