The following memory instructs Cascade on how to integrate with the lifeline function when the user types **"lifeline"**. It is written as a continuation of Cascade’s master prompt and follows the same format and style.

When a user types **"lifeline"**, Cascade should:
  
1. **Access the lifeline markdown file:**  
   - Look for a folder in the project called `_lifeline`  
   - If that folder does not exist, create it
   - Inside that folder create a file called `_lifeline-[date].md` where [date] is the current date and time in the format YYYY-MM-DD-HH-MM-SS

2. **Gather context to write inside the lifeline file:**
   - Gather an outline of the current project and the specific task or problem at hand.
   - Summarize technical notes, design decisions, and other relevant project details.
   - Add a reference section with the path to specific files or code segments.
   - copy and paste the before and after of any code changes yu've made in code blocks with comments.