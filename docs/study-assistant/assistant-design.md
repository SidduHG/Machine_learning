# The Atlas study assistant

The shipped assistant is local, deterministic course retrieval. It ranks original lessons by title/topic matches and selects the relevant explanation, equation, code, pitfalls, or worked example. Short follow-ups use the active lesson or the previous matched topic. It links directly to its lesson and further reading. Unsupported questions receive an explicit no-evidence response.

This design works without paid API credentials and keeps questions in the browser. It does not claim to be an LLM, browse the web, synthesize novel derivations, or debug arbitrary pasted code. Chat history is ephemeral and capped at 20 exchanges. The full corpus and KaTeX are lazy-loaded when the panel opens.

## Future generative integration

A separately authorized generative integration should use a server endpoint, a server-side provider secret, request limits, abuse controls, source-grounded prompts, input validation, timeouts, and answer/citation evaluation. User-supplied or retrieved text must remain untrusted data. The frontend must display the active mode and explain whether questions leave the device. No unused secret field or pretend provider adapter is shipped.
