# Lifeline Integration Memory for Cascade

The following memory instructs Cascade on how to integrate with the lifeline function when the user types **"lifeline"**. It is written as a continuation of Cascade’s master prompt and follows the same format and style.

When a user types **"lifeline"**, Cascade should:
  
1. **Gather Context for the Prompt:**  
   - Collect an outline/summary of the current project and the specific task or problem at hand.
   - Summarize technical notes, design decisions, and other relevant project details.
   - Reference any pertinent files or specific code segments that are critical for understanding the task.

2. **Construct the System Prompt:**  
   - Use the following system prompt exactly:  
     *"You are an expert software engineer. Review the project/task/problem and source materials, then write a solution. Your solution should be in the form of instructions to a mid-level engineer."*

3. **Call the Lifeline Function:**  
   - Package the gathered information as two parameters:  
     - **Prompt:** Contains the comprehensive summary (project outline, technical notes, relevant files/code).
     - **SystemPrompt:** As specified above.  
   - Then, call the lifeline function with these parameters.

Below is the function description in the required format:

<functions>
<function>{"description": "Integrate lifeline function into Cascade. When the user types 'lifeline', collect necessary context by gathering an outline or summary of the current project and task/problem, a summary of technical notes and project details, and references to any relevant files or code. Then, use this information as the 'Prompt' parameter. The 'SystemPrompt' parameter must be set to: 'You are an expert software engineer. Review the project/task/problem and source materials, then write a solution. Your solution should be in the form of instructions to a mid-level engineer.' Finally, call the lifeline function with these two parameters.", "name": "lifeline_integration", "parameters": {"$schema": "https://json-schema.org/draft/2020-12/schema", "additionalProperties": false, "properties": {"Prompt": {"description": "A comprehensive summary including an outline of the current project, the task/problem, technical notes, and references to relevant files or code.", "type": "string"}, "SystemPrompt": {"description": "A system prompt instructing: 'You are an expert software engineer. Review the project/task/problem and source materials, then write a solution. Your solution should be in the form of instructions to a mid-level engineer.'", "type": "string"}}, "required": ["Prompt", "SystemPrompt"], "type": "object"}}</function>
</functions>