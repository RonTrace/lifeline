<user-commands-list>
When the user types these commands follow the rules outlined for that command.
<user-command>
  When a user types **"lifeline"**, Cascade should:
    <lifeline>
    Follow the directions below in the <lifeline-prompt> section
    </lifeline>
</user-command>

<user-command>
  When a user types **"lifeline spec"**, Cascade should:
    <lifeline>
    Follow the directions below in the <lifeline-spec-prompt> section
    </lifeline>
</user-command>
</user-commands-list>

<lifeline-prompt>
  <step>  
  1. **Create a lifeline markdown file:**  
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

<lifeline-spec-prompt>
  <step>  
  1. **Create a lifeline markdown file:**  
    - Look for a folder in the project called `_lifeline`.  
    - If that folder does not exist, create it.  
    - Inside that folder, create a file called `_lifeline-[date].md`, where [date] is the current date and time in the format `YYYY-MM-DD-HH-MM-SS`.  
  </step>
  <step>
  2. **Gather context to write a comprehensive project specification inside the lifeline file:**  
    - Summarize the current project and describe the specific task or problem at hand.
    - Create user stories, use cases, or requirements (e.g. As a user, I want to click a button in a modal to close it.)
    - If you are unclear about the user stories, ask for clarification.  
    - Document technical notes, design decisions, and other relevant project details.  
    - Include a reference section with paths to specific files or code segments.  
    - If applicable, **log the intended** before and after states of any planned code changes in code blocks (without applying changes to the actual codebase).  
  </step>
  <step>
  3. **Important**  
    - **Only create the _lifeline file.**  
    - **Do not make any modifications to the existing codebase.**  
    - **Do not edit or modify files. Only document information inside the lifeline file.**  
  </step>
</lifeline-prompt>