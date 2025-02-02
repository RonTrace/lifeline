# ADR-002: Lifeline Integration Design

## Date
2025-02-02

## Status
Accepted

## Context
The project needed to implement a specific workflow for when users type "lifeline" in their interactions with Cascade. This required a standardized approach to:
- Creating and managing documentation files
- Capturing project context and history
- Maintaining a consistent format for lifeline entries

## Decision
We implemented a standardized lifeline workflow:

1. **Directory Structure**
   - Created `_lifeline` directory for all lifeline-related files
   - Used timestamp-based naming convention: `_lifeline-YYYY-MM-DD-HH-MM-SS.md`

2. **Content Structure**
   Each lifeline document includes:
   - Project overview and current state
   - Technical notes and design decisions
   - File references and code changes
   - Before/after code comparisons with comments

3. **Integration Method**
   - Added global prompt instructions for Cascade
   - Implemented automatic file creation and management
   - Added clipboard integration for responses

## Technical Implementation
- File naming pattern: `_lifeline-[date].md`
- Markdown-based documentation
- Automatic timestamp generation
- Context gathering functionality

## Consequences
### Positive
- Standardized documentation format
- Automatic context capture
- Clear historical record of project evolution
- Easy integration with existing workflows

### Negative
- Need to maintain consistent formatting
- Potential for large number of documentation files
- Must ensure proper file cleanup/archival
