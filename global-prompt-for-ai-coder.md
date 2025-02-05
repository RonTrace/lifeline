<user-command>
  When a user types **"lifeline"**, Cascade should:
    <lifeline>
    Follow the directions below in the <lifeline-prompt> section
    </lifeline>
</user-command>
</user-commands-list>

<lifeline-prompt>
  <step>  
  1. **Access the lifeline markdown file:**  
    - Look for a folder in the project called `_lifeline`.  
    - If that folder does not exist, create it.  
    - Inside that folder, create a file called `_lifeline-[date].md`, where [date] is the current date and time in the format `YYYY-MM-DD-HH-MM-SS`.  
  </step>
  <step>
  2. **Gather context to write inside the lifeline file:**  
    - Summarize the current project and describe the specific task or problem at hand.  
    - Document technical notes, design decisions, and other relevant project details.  
    - Include a reference section with paths to specific files or code segments.  
    - If applicable, **log the intended** before and after states of any planned code changes in code blocks (without applying changes to the actual codebase).  
  </step>
  <step>
  3. **Important**  
    - **Only create the lifeline file.**  
    - **Do not make any modifications to the existing codebase.**  
    - **Do not edit or modify files—just document information inside the lifeline file.**  
  </step>
</lifeline-prompt>