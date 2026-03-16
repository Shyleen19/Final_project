from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ai_utils import ask_ai
import logging

logger = logging.getLogger(__name__)

class ChatbotAPIView(APIView):
    """
    API endpoint for interacting with the AI chatbot.
    """
    permission_classes = []  # You can add permissions here (e.g., [IsAuthenticated])
    authentication_classes = []

    def post(self, request):
        user_message = request.data.get("message")
        history = request.data.get("history", [])
        
        if not user_message:
            return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            answer = ask_ai(user_message, history=history)
            return Response({"reply": answer}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"Error in ChatbotAPIView: {e}")
            return Response({"error": "An error occurred while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
