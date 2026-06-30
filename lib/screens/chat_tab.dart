import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';
import '../providers/app_state.provider.dart';

class ChatTab extends StatefulWidget {
  const ChatTab({super.key});

  @override
  State<ChatTab> createState() => _ChatTabState();
}

class _ChatTabState extends State<ChatTab> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _onSend(String text) {
    if (text.trim().isEmpty) return;
    final state = Provider.of<AppStateProvider>(context, listen: false);
    state.sendMessage(text);
    _messageController.clear();
    // Scroll down after frame renders
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context);
    // Trigger scroll bottom when typing status changes
    if (state.isTypingResponse) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Chat Header
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.paddingContainer,
                vertical: AppStyles.spaceMd,
              ),
              decoration: const BoxDecoration(
                color: AppColors.surfaceContainerLowest,
                boxShadow: [
                  BoxShadow(
                    color: Color(0x05000000),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // AI Avatar representation
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer.withOpacity(0.12),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primaryContainer.withOpacity(0.3)),
                    ),
                    child: const Center(
                      child: Icon(Icons.support_agent_rounded, color: AppColors.primary, size: 24),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "AI Pharmacist Assistant",
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onSurface,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.primaryContainer,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            "Online & Analyzing",
                            style: AppStyles.labelSm.copyWith(
                              fontSize: 10,
                              color: AppColors.onSurfaceVariant.withOpacity(0.7),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Message List
            Expanded(
              child: ListView.separated(
                controller: _scrollController,
                padding: const EdgeInsets.all(AppStyles.paddingContainer),
                itemCount: state.chatMessages.length,
                separatorBuilder: (context, index) => const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final msg = state.chatMessages[index];
                  return _buildMessageBubble(msg.text, msg.isUser);
                },
              ),
            ),

            // Suggestion Chips (horizontal list)
            if (!state.isTypingResponse && state.chatMessages.length <= 2)
              SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: AppStyles.paddingContainer),
                  children: [
                    _buildSuggestionChip("Paracetamol safety guidelines?"),
                    const SizedBox(width: 8),
                    _buildSuggestionChip("Show side effects"),
                    const SizedBox(width: 8),
                    _buildSuggestionChip("Am I allergic to anything?"),
                  ],
                ),
              ),

            // Typing Indicator
            if (state.isTypingResponse)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppStyles.paddingContainer, vertical: 8),
                child: Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: const BoxDecoration(
                        color: AppColors.surfaceContainerLow,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.support_agent_rounded, color: AppColors.outline, size: 16),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLowest,
                        borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                        border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            "AI Pharmacist is analyzing",
                            style: AppStyles.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
                          ),
                          const SizedBox(width: 8),
                          const SizedBox(
                            width: 10,
                            height: 10,
                            child: CircularProgressIndicator(
                              strokeWidth: 1.5,
                              valueColor: AlwaysStoppedAnimation<Color>(AppColors.outline),
                            ),
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),

            // Message Input bar
            Container(
              padding: const EdgeInsets.only(
                left: AppStyles.paddingContainer,
                right: AppStyles.paddingContainer,
                top: 12,
                bottom: 100, // Leave room for floating shell nav bar
              ),
              decoration: const BoxDecoration(
                color: AppColors.surfaceContainerLowest,
                border: Border(top: BorderSide(color: Colors.black12, width: 0.5)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                      ),
                      child: TextField(
                        controller: _messageController,
                        onSubmitted: _onSend,
                        decoration: InputDecoration(
                          hintText: "Ask about dosage, side effects...",
                          hintStyle: AppStyles.bodyMd.copyWith(color: AppColors.outline),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  InkWell(
                    onTap: () => _onSend(_messageController.text),
                    borderRadius: BorderRadius.circular(100),
                    child: Container(
                      width: 48,
                      height: 48,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryContainer,
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.send_rounded, color: AppColors.onPrimaryContainer, size: 20),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble(String text, bool isUser) {
    final bgColor = isUser ? AppColors.primary : AppColors.surfaceContainerLowest;
    final textColor = isUser ? Colors.white : AppColors.onSurface;
    final alignment = isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final bubbleRadius = isUser
        ? const BorderRadius.only(
            topLeft: Radius.circular(AppStyles.radiusLg),
            topRight: Radius.circular(AppStyles.radiusLg),
            bottomLeft: Radius.circular(AppStyles.radiusLg),
          )
        : const BorderRadius.only(
            topLeft: Radius.circular(AppStyles.radiusLg),
            topRight: Radius.circular(AppStyles.radiusLg),
            bottomRight: Radius.circular(AppStyles.radiusLg),
          );

    return Column(
      crossAxisAlignment: alignment,
      children: [
        Row(
          mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isUser) ...[
              Container(
                margin: const EdgeInsets.only(top: 4),
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(Icons.support_agent_rounded, color: AppColors.primary, size: 16),
                ),
              ),
              const SizedBox(width: 12),
            ],
            Flexible(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: bubbleRadius,
                  border: isUser ? null : Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                  boxShadow: AppStyles.level1Shadow,
                ),
                child: Text(
                  text,
                  style: AppStyles.bodyMd.copyWith(
                    color: textColor,
                    height: 1.4,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSuggestionChip(String text) {
    return ActionChip(
      label: Text(
        text,
        style: AppStyles.labelSm.copyWith(
          color: AppColors.primary,
          fontWeight: FontWeight.w600,
          fontSize: 11,
          letterSpacing: 0,
        ),
      ),
      backgroundColor: AppColors.primaryContainer.withOpacity(0.08),
      side: BorderSide(color: AppColors.primary.withOpacity(0.2)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
      onPressed: () => _onSend(text),
    );
  }
}
