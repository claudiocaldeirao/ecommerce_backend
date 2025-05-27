/*
 * This Terraform configuration sets up a load balancer for the E-commerce application.
 * The load balancer is an Application Load Balancer (ALB) that distributes incoming HTTP traffic
 * across multiple target groups, ensuring high availability and fault tolerance.
 * The ALB is configured with health checks and listener rules to forward traffic to the target group.
 */
resource "aws_lb" "this" {
  name            = "alb"
  security_groups = [aws_security_group.alb.id]
  subnets         = [aws_subnet.this["pub_a"].id, aws_subnet.this["pub_b"].id]
  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_load_balancer"
    }
  )
}

resource "aws_lb_target_group" "this" {
  name     = "alb-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.this.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_target_group"
    }
  )
}

resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }

  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_listener"
    }
  )
}
