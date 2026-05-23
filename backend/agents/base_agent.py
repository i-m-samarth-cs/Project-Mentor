from tools.llm import chat

class BaseAgent:
    system_prompt = "You are a helpful expert assistant."

    def run(self, idea: str) -> str:
        return chat(self.system_prompt, self._build_prompt(idea))

    def _build_prompt(self, idea: str) -> str:
        return idea
