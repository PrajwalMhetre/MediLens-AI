import 'package:flutter/material.dart';
import 'package:medilens_ai/app/state/app_state_provider.dart';
import 'package:medilens_ai/core/theme/colors.dart';
import 'package:medilens_ai/core/theme/styles.dart';
import 'package:provider/provider.dart';

class ChatTab extends StatefulWidget {
  const ChatTab({super.key});

  @override
  State<ChatTab> createState() => _ChatTabState();
}

class _ChatTabState extends State<ChatTab> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  int _previousMessageCount = 0;

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      Future.delayed(const Duration(milliseconds: 100), () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
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

    // Auto-scroll when new messages arrive (both user and AI)
    if (state.chatMessages.length != _previousMessageCount) {
      _previousMessageCount = state.chatMessages.length;
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    }

    // Also scroll when typing status changes
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
                      color: AppColors.primaryContainer.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.primaryContainer.withValues(
                          alpha: 0.3,
                        ),
                      ),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.support_agent_rounded,
                        color: AppColors.primary,
                        size: 24,
                      ),
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
                            state.isTypingResponse
                                ? "Typing..."
                                : "Online & Analyzing",
                            style: AppStyles.labelSm.copyWith(
                              fontSize: 10,
                              color: AppColors.onSurfaceVariant.withValues(
                                alpha: 0.7,
                              ),
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
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 16),
                itemBuilder: (context, index) {
                  final msg = state.chatMessages[index];
                  return _AnimatedMessageBubble(
                    key: ValueKey('msg_${msg.timestamp.millisecondsSinceEpoch}_$index'),
                    text: msg.text,
                    isUser: msg.isUser,
                    // Animate only the last 2 messages (newly added)
                    shouldAnimate:
                        index >= state.chatMessages.length - 2,
                  );
                },
              ),
            ),

            // Suggestion Chips (horizontal list)
            if (!state.isTypingResponse && state.chatMessages.length <= 2)
              SizedBox(
                height: 40,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingContainer,
                  ),
                  children: [
                    _buildSuggestionChip("Paracetamol safety guidelines?"),
                    const SizedBox(width: 8),
                    _buildSuggestionChip("Show side effects"),
                    const SizedBox(width: 8),
                    _buildSuggestionChip("Am I allergic to anything?"),
                  ],
                ),
              ),

            // Typing Indicator — bouncing dots
            if (state.isTypingResponse)
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppStyles.paddingContainer,
                  vertical: 8,
                ),
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
                        child: Icon(
                          Icons.support_agent_rounded,
                          color: AppColors.outline,
                          size: 16,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLowest,
                        borderRadius:
                            BorderRadius.circular(AppStyles.radiusMd),
                        border: Border.all(
                          color: AppColors.outlineVariant.withValues(
                            alpha: 0.3,
                          ),
                        ),
                      ),
                      child: const _BouncingDotsIndicator(),
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
                border: Border(
                  top: BorderSide(color: Colors.black12, width: 0.5),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow.withValues(
                          alpha: 0.6,
                        ),
                        borderRadius:
                            BorderRadius.circular(AppStyles.radiusMd),
                      ),
                      child: TextField(
                        controller: _messageController,
                        onSubmitted: _onSend,
                        decoration: InputDecoration(
                          hintText: "Ask about dosage, side effects...",
                          hintStyle: AppStyles.bodyMd.copyWith(
                            color: AppColors.outline,
                          ),
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
                        child: Icon(
                          Icons.send_rounded,
                          color: AppColors.onPrimaryContainer,
                          size: 20,
                        ),
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
      backgroundColor: AppColors.primaryContainer.withValues(alpha: 0.08),
      side: BorderSide(color: AppColors.primary.withValues(alpha: 0.2)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(100)),
      onPressed: () => _onSend(text),
    );
  }
}

/// Animated message bubble with slide-up + fade-in entrance
class _AnimatedMessageBubble extends StatefulWidget {
  final String text;
  final bool isUser;
  final bool shouldAnimate;

  const _AnimatedMessageBubble({
    super.key,
    required this.text,
    required this.isUser,
    this.shouldAnimate = true,
  });

  @override
  State<_AnimatedMessageBubble> createState() => _AnimatedMessageBubbleState();
}

class _AnimatedMessageBubbleState extends State<_AnimatedMessageBubble>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeIn;
  late Animation<Offset> _slideIn;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _fadeIn = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    _slideIn = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));

    if (widget.shouldAnimate) {
      _controller.forward();
    } else {
      _controller.value = 1.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = widget.isUser
        ? AppColors.primary
        : AppColors.surfaceContainerLowest;
    final textColor = widget.isUser ? Colors.white : AppColors.onSurface;
    final alignment = widget.isUser
        ? CrossAxisAlignment.end
        : CrossAxisAlignment.start;
    final bubbleRadius = widget.isUser
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

    return FadeTransition(
      opacity: _fadeIn,
      child: SlideTransition(
        position: _slideIn,
        child: Column(
          crossAxisAlignment: alignment,
          children: [
            Row(
              mainAxisAlignment: widget.isUser
                  ? MainAxisAlignment.end
                  : MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!widget.isUser) ...[
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color:
                          AppColors.primaryContainer.withValues(alpha: 0.12),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.support_agent_rounded,
                        color: AppColors.primary,
                        size: 16,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: bubbleRadius,
                      border: widget.isUser
                          ? null
                          : Border.all(
                              color: AppColors.outlineVariant.withValues(
                                alpha: 0.3,
                              ),
                            ),
                      boxShadow: AppStyles.level1Shadow,
                    ),
                    child: Text(
                      widget.text,
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
        ),
      ),
    );
  }
}

/// Three bouncing dots typing indicator
class _BouncingDotsIndicator extends StatefulWidget {
  const _BouncingDotsIndicator();

  @override
  State<_BouncingDotsIndicator> createState() => _BouncingDotsIndicatorState();
}

class _BouncingDotsIndicatorState extends State<_BouncingDotsIndicator>
    with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(3, (i) {
      return AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 600),
      );
    });

    _animations = _controllers.map((c) {
      return Tween<double>(begin: 0.0, end: -6.0).animate(
        CurvedAnimation(parent: c, curve: Curves.easeInOut),
      );
    }).toList();

    // Stagger the dots
    for (var i = 0; i < 3; i++) {
      Future.delayed(Duration(milliseconds: i * 180), () {
        if (mounted) {
          _controllers[i].repeat(reverse: true);
        }
      });
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(3, (i) {
        return AnimatedBuilder(
          animation: _animations[i],
          builder: (context, child) {
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 3),
              child: Transform.translate(
                offset: Offset(0, _animations[i].value),
                child: child,
              ),
            );
          },
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: AppColors.outline.withValues(alpha: 0.6),
              shape: BoxShape.circle,
            ),
          ),
        );
      }),
    );
  }
}
