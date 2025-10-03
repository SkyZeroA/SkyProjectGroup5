class Questionnaire:
    def __init__(self, answers):
        self._questionnaire = answers

    # def __str__(self):
    #     #TODO: format into database ready input
    #     return self._questionnaire

    def get_questionnaire(self):
        return self._questionnaire
