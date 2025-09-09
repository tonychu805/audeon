# Analysis Workflow Standards

## /sc:analyze Process Steps

### 1. Pre-Analysis Setup
- Activate project and complete onboarding if needed
- Check current date for proper report naming
- Review project structure and tech stack

### 2. Historical Context Review
- **ALWAYS check latest analysis report** in `Documents/analysis/`
- Read most recent `ANALYSIS_REPORT_YYYY-MM-DD.md`
- Identify previous issues, recommendations, and grades
- Note any improvements or regressions since last analysis

### 3. Current Analysis Execution
- Perform comprehensive code quality assessment
- Check for TypeScript errors, linting issues, console logs
- Evaluate architecture, security, and performance
- Search for common code quality issues

### 4. Comparative Assessment
- **Compare against previous report findings**
- Track improvement/regression in each category
- Note which recommendations were implemented
- Highlight new issues that emerged
- Update grades based on progress

### 5. Report Generation
- Use standardized template from documentation_standards
- Include "Progress Since Last Analysis" section
- Reference previous report date and key changes
- Provide trend analysis (improving/stable/declining)
- Update recommendations based on current state

## Report Improvement Tracking

### Progress Section Template
```markdown
## 📈 Progress Since Last Analysis (YYYY-MM-DD)

### ✅ Issues Resolved
- [List fixed issues from previous report]

### ⚡ Improvements Made  
- [List quality improvements]

### ❌ New Issues Identified
- [List new problems not in previous report]

### 📊 Grade Comparison
| Category | Previous | Current | Trend |
|----------|----------|---------|-------|
| Architecture | [Grade] | [Grade] | ⬆️/⬇️/➡️ |
| Code Quality | [Grade] | [Grade] | ⬆️/⬇️/➡️ |

**Overall Trend: [Improving/Stable/Declining]**
```

### Trend Indicators
- ⬆️ Improved
- ⬇️ Declined  
- ➡️ No change

## Implementation Checklist
- [ ] Read latest analysis report before starting
- [ ] Compare previous grades and issues
- [ ] Track which recommendations were implemented
- [ ] Include progress section in new report
- [ ] Provide trend analysis and updated recommendations
- [ ] Reference specific improvements or regressions