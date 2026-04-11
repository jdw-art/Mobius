"""
Seed script for Mobius DevOps Platform
Run with: python -m scripts.seed
"""
import uuid
from datetime import datetime, date, timedelta

from sqlalchemy import create_engine, select, delete
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.config import settings
from app.models.base import Base
from app.models.project import Project
from app.models.requirement import Requirement
from app.models.application import Application
from app.models.defect import Defect
from app.models.document import Document
from app.models.team_member import TeamMember
from app.models.workflow_step import WorkflowStep
from app.models.activity import Activity
from app.models.build import Build
from app.models.review import Review, ReviewProcess
from app.models.test_case import TestCase
from app.models.risk import Risk
from app.models.user import User

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def seed():
    engine = create_engine(settings.sync_database_url)
    # Create tables if they don't exist (don't drop users table)
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Create default admin user if not exists
        admin_user = session.execute(select(User).where(User.username == "admin")).scalar_one_or_none()
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                username="admin",
                password_hash=pwd_context.hash("admin123"),
            )
            session.add(admin_user)

        # Delete existing project PRJ001 data (keep users)
        # Delete related records first (they reference project_id)
        session.execute(Activity.__table__.delete().where(Activity.project_id == 'PRJ001'))
        session.execute(WorkflowStep.__table__.delete().where(WorkflowStep.project_id == 'PRJ001'))
        session.execute(TeamMember.__table__.delete().where(TeamMember.project_id == 'PRJ001'))
        session.execute(Risk.__table__.delete().where(Risk.project_id == 'PRJ001'))
        session.execute(TestCase.__table__.delete().where(TestCase.project_id == 'PRJ001'))
        session.execute(ReviewProcess.__table__.delete().where(ReviewProcess.review_id.in_(
            select(Review.id).where(Review.project_id == 'PRJ001')
        )))
        session.execute(Review.__table__.delete().where(Review.project_id == 'PRJ001'))
        session.execute(Build.__table__.delete().where(Build.project_id == 'PRJ001'))
        session.execute(Document.__table__.delete().where(Document.project_id == 'PRJ001'))
        session.execute(Defect.__table__.delete().where(Defect.project_id == 'PRJ001'))
        session.execute(Application.__table__.delete().where(Application.project_id == 'PRJ001'))
        session.execute(Requirement.__table__.delete().where(Requirement.project_id == 'PRJ001'))
        session.execute(Project.__table__.delete().where(Project.id == 'PRJ001'))
        session.commit()
        # Create project PRJ001
        project = Project(
            id="PRJ001",
            name="用户管理系统重构",
            type="日常项目",
            status="进行中",
            pm="张三",
            progress="进行中",
            create_time=datetime(2024, 1, 15, 9, 0, 0),
            planned_design_time=date(2024, 1, 25),
            planned_test_submit_time=date(2024, 2, 15),
            planned_test_complete_time=date(2024, 2, 25),
            planned_release_time=date(2024, 3, 5),
            planned_delivery=date(2024, 3, 15),
            planned_duration="45个工作日",
            budget="资金安全",
            change_type="功能优化",
            related_product="用户中心",
            app_count=3,
            project_duration=25,
        )
        session.add(project)

        # Requirements (5 records)
        requirements = [
            Requirement(id="REQ001", project_id="PRJ001", name="用户管理功能优化", version="V2.1.0", application="用户中心", module="用户管理", level="高", creator="张三", create_time=datetime(2024, 1, 15)),
            Requirement(id="REQ002", project_id="PRJ001", name="登录流程重构", version="V2.1.0", application="统一认证", module="认证中心", level="高", creator="李四", create_time=datetime(2024, 1, 16)),
            Requirement(id="REQ003", project_id="PRJ001", name="新增数据报表功能", version="V2.1.0", application="数据分析平台", module="报表管理", level="中", creator="王五", create_time=datetime(2024, 1, 17)),
            Requirement(id="REQ004", project_id="PRJ001", name="性能优化", version="V2.1.0", application="用户中心", module="接口服务", level="中", creator="赵六", create_time=datetime(2024, 1, 18)),
            Requirement(id="REQ005", project_id="PRJ001", name="安全加固", version="V2.1.0", application="统一认证", module="安全模块", level="高", creator="钱七", create_time=datetime(2024, 1, 19)),
        ]
        for r in requirements:
            session.add(r)

        # Applications (5 records)
        applications = [
            Application(id="APP001", project_id="PRJ001", name="用户中心", branch="master", version="V2.1.0", test_status="已测试", deploy_method="maven", unit_test="通过", code_scan="通过", code_review="评审通过", status="正常"),
            Application(id="APP002", project_id="PRJ001", name="统一认证", branch="develop", version="V2.1.0", test_status="已测试", deploy_method="dubbo", unit_test="通过", code_scan="通过", code_review="评审通过", status="正常"),
            Application(id="APP003", project_id="PRJ001", name="数据分析平台", branch="feature/report", version="V2.1.0", test_status="未测试", deploy_method="tomcat", unit_test="未通过", code_scan="未通过", code_review="驳回", status="待修复"),
            Application(id="APP004", project_id="PRJ001", name="订单管理系统", branch="master", version="V1.5.0", test_status="已测试", deploy_method="maven", unit_test="通过", code_scan="通过", code_review="评审通过", status="正常"),
            Application(id="APP005", project_id="PRJ001", name="支付服务", branch="develop", version="V1.2.0", test_status="未测试", deploy_method="dubbo", unit_test="通过", code_scan="通过", code_review="未开始", status="开发中"),
        ]
        for a in applications:
            session.add(a)

        # Defects (8 records)
        defects = [
            Defect(id="DEF001", project_id="PRJ001", application_id="APP001", name="登录页面输入框长度限制问题", environment="测试环境", developer="张三", tester="钱七", status="打开", creator="钱七", create_time=datetime(2024, 2, 15, 10, 30, 0)),
            Defect(id="DEF002", project_id="PRJ001", application_id="APP001", name="用户列表分页功能异常", environment="测试环境", developer="李四", tester="钱七", status="修复中", creator="钱七", create_time=datetime(2024, 2, 16, 14, 20, 0)),
            Defect(id="DEF003", project_id="PRJ001", application_id="APP002", name="权限验证逻辑错误", environment="UAT环境", developer="王五", tester="孙八", status="关闭", creator="孙八", create_time=datetime(2024, 2, 14, 9, 45, 0)),
            Defect(id="DEF004", project_id="PRJ001", application_id="APP003", name="数据导出功能无法正常使用", environment="测试环境", developer="赵六", tester="钱七", status="打开", creator="钱七", create_time=datetime(2024, 2, 17, 11, 15, 0)),
            Defect(id="DEF005", project_id="PRJ001", application_id="APP003", name="界面响应速度慢", environment="UAT环境", developer="赵六", tester="孙八", status="修复中", creator="孙八", create_time=datetime(2024, 2, 18, 15, 30, 0)),
            Defect(id="DEF006", project_id="PRJ001", application_id="APP001", name="用户信息更新后缓存未更新", environment="测试环境", developer="张三", tester="钱七", status="关闭", creator="钱七", create_time=datetime(2024, 2, 12, 16, 45, 0)),
            Defect(id="DEF007", project_id="PRJ001", application_id="APP003", name="特定条件下查询结果为空", environment="UAT环境", developer="李四", tester="孙八", status="打开", creator="孙八", create_time=datetime(2024, 2, 19, 10, 20, 0)),
            Defect(id="DEF008", project_id="PRJ001", application_id="APP001", name="密码重置功能验证码超时", environment="测试环境", developer="王五", tester="钱七", status="修复中", creator="钱七", create_time=datetime(2024, 2, 20, 13, 50, 0)),
        ]
        for d in defects:
            session.add(d)

        # Documents (2 records)
        documents = [
            Document(id="DOC001", project_id="PRJ001", type="需求文档", name="用户管理系统需求规格说明书", link="https://example.com/docs/req001.pdf", creator="张三", create_time=datetime(2024, 1, 10)),
            Document(id="DOC002", project_id="PRJ001", type="详细设计", name="用户管理系统架构设计文档", link="https://example.com/docs/design001.pdf", creator="李四", create_time=datetime(2024, 1, 15)),
        ]
        for d in documents:
            session.add(d)

        # Team Members (8 records)
        team_members = [
            TeamMember(id="TM001", project_id="PRJ001", role="产品负责人", name="张三", avatar="张", emp_id="10001"),
            TeamMember(id="TM002", project_id="PRJ001", role="开发负责人", name="李四", avatar="李", emp_id="10002"),
            TeamMember(id="TM003", project_id="PRJ001", role="PM", name="王五", avatar="王", emp_id="10003"),
            TeamMember(id="TM004", project_id="PRJ001", role="开发", name="赵六", avatar="赵", emp_id="10004"),
            TeamMember(id="TM005", project_id="PRJ001", role="测试", name="钱七", avatar="钱", emp_id="10005"),
            TeamMember(id="TM006", project_id="PRJ001", role="运维", name="孙八", avatar="孙", emp_id="10006"),
            TeamMember(id="TM007", project_id="PRJ001", role="预发布验证", name="周九", avatar="周", emp_id="10007"),
            TeamMember(id="TM008", project_id="PRJ001", role="生产验证", name="吴十", avatar="吴", emp_id="10008"),
        ]
        for tm in team_members:
            session.add(tm)

        # Workflow Steps (7 records)
        workflow_steps = [
            WorkflowStep(id="WS001", project_id="PRJ001", step=1, name="创建", status="completed", time=datetime(2024, 1, 15, 9, 0, 0)),
            WorkflowStep(id="WS002", project_id="PRJ001", step=2, name="设计", status="completed", time=datetime(2024, 1, 25, 17, 0, 0)),
            WorkflowStep(id="WS003", project_id="PRJ001", step=3, name="开发", status="current", time=datetime(2024, 2, 10, 14, 0, 0)),
            WorkflowStep(id="WS004", project_id="PRJ001", step=4, name="测试", status="pending", time=None),
            WorkflowStep(id="WS005", project_id="PRJ001", step=5, name="预发布", status="pending", time=None),
            WorkflowStep(id="WS006", project_id="PRJ001", step=6, name="生产发布", status="pending", time=None),
            WorkflowStep(id="WS007", project_id="PRJ001", step=7, name="合并主干", status="pending", time=None),
        ]
        for ws in workflow_steps:
            session.add(ws)

        # Activities (12 records)
        activities = [
            Activity(id="ACT001", project_id="PRJ001", type="创建", time=datetime(2024, 1, 15, 9, 0, 0), user="张三", action="创建了项目"),
            Activity(id="ACT002", project_id="PRJ001", type="设计", time=datetime(2024, 1, 20, 14, 30, 0), user="李四", action="完成了系统设计文档"),
            Activity(id="ACT003", project_id="PRJ001", type="开发", time=datetime(2024, 1, 25, 16, 0, 0), user="王五", action="开始前端开发"),
            Activity(id="ACT004", project_id="PRJ001", type="开发", time=datetime(2024, 2, 1, 10, 0, 0), user="赵六", action="完成后端API开发"),
            Activity(id="ACT005", project_id="PRJ001", type="测试", time=datetime(2024, 2, 10, 14, 0, 0), user="钱七", action="开始单元测试"),
            Activity(id="ACT006", project_id="PRJ001", type="开发", time=datetime(2024, 2, 12, 11, 20, 0), user="王五", action="集成了用户鉴权模块"),
            Activity(id="ACT007", project_id="PRJ001", type="评审", time=datetime(2024, 2, 13, 15, 45, 0), user="李四", action="完成代码评审并给出修改意见"),
            Activity(id="ACT008", project_id="PRJ001", type="测试", time=datetime(2024, 2, 14, 9, 30, 0), user="钱七", action="提交第一轮冒烟测试报告"),
            Activity(id="ACT009", project_id="PRJ001", type="开发", time=datetime(2024, 2, 15, 18, 5, 0), user="赵六", action="根据评审意见修复若干问题"),
            Activity(id="ACT010", project_id="PRJ001", type="测试", time=datetime(2024, 2, 16, 13, 22, 0), user="钱七", action="新增接口自动化用例"),
            Activity(id="ACT011", project_id="PRJ001", type="预发布", time=datetime(2024, 2, 18, 10, 10, 0), user="周九", action="预发环境完成部署"),
            Activity(id="ACT012", project_id="PRJ001", type="运维", time=datetime(2024, 2, 19, 17, 40, 0), user="孙八", action="完成资源扩容与监控配置"),
        ]
        for a in activities:
            session.add(a)

        # Builds (5 records)
        builds = [
            Build(id="BLD001", project_id="PRJ001", branch="master", tester="钱七", coverage=78, can_update_coverage=True, build_status="构建成功", deploy_status="部署成功"),
            Build(id="BLD002", project_id="PRJ001", branch="develop", tester="孙八", coverage=65, can_update_coverage=True, build_status="构建成功", deploy_status="部署中"),
            Build(id="BLD003", project_id="PRJ001", branch="feature/report", tester="周九", coverage=90, can_update_coverage=False, build_status="构建成功", deploy_status="未部署"),
            Build(id="BLD004", project_id="PRJ001", branch="feature/payment", tester="吴十", coverage=45, can_update_coverage=True, build_status="构建中", deploy_status="未部署"),
            Build(id="BLD005", project_id="PRJ001", branch="bugfix/login", tester="钱七", coverage=30, can_update_coverage=True, build_status="构建失败", deploy_status="未部署"),
        ]
        for b in builds:
            session.add(b)

        # Reviews with ReviewProcesses
        reviews = [
            Review(
                id="REV001", project_id="PRJ001", type="design", requirement_id="REQ001",
                title="用户管理系统架构设计评审", creator="李四",
                create_time=datetime(2024, 1, 20, 14, 30, 0),
                planned_complete_time=datetime(2024, 1, 25, 17, 0, 0),
            ),
            Review(
                id="REV002", project_id="PRJ001", type="code", requirement_id="REQ001",
                title="用户管理系统代码评审", creator="赵六",
                create_time=datetime(2024, 2, 10, 9, 15, 0),
                planned_complete_time=datetime(2024, 2, 15, 17, 0, 0),
                code_branch="feature/code-review-2024",
            ),
            Review(
                id="REV003", project_id="PRJ001", type="test-case", requirement_id="REQ001",
                title="用户管理系统测试用例评审", creator="钱七",
                create_time=datetime(2024, 3, 10, 9, 30, 0),
                planned_complete_time=datetime(2024, 3, 15, 17, 0, 0),
            ),
            Review(
                id="REV004", project_id="PRJ001", type="release", requirement_id="REQ001",
                title="用户管理系统发布评审", creator="王五",
                create_time=datetime(2024, 3, 15, 10, 0, 0),
                planned_complete_time=datetime(2024, 3, 28, 17, 0, 0),
                pre_release_time=datetime(2024, 3, 20, 14, 30, 0),
                prod_release_time=datetime(2024, 3, 25, 10, 0, 0),
            ),
        ]
        for r in reviews:
            session.add(r)

        # ReviewProcesses
        review_processes = [
            ReviewProcess(id="RP001", review_id="REV001", title="测试评审", description="测试负责人确认设计的可测试性", status="pending", reviewers=["钱七", "孙八"], review_time=datetime(2024, 1, 23, 10, 15, 30), comment="", comment_editable=True),
            ReviewProcess(id="RP002", review_id="REV001", title="技术团队负责人评审", description="技术负责人确认设计的技术可行性", status="pending", reviewers=["李四"], review_time=datetime(2024, 1, 24, 14, 30, 45), comment="", comment_editable=True),
            ReviewProcess(id="RP003", review_id="REV001", title="产品评审", description="产品负责人确认设计符合产品需求", status="pending", reviewers=["张三"], review_time=datetime(2024, 1, 25, 16, 20, 10), comment="", comment_editable=True),
            ReviewProcess(id="RP004", review_id="REV002", title="技术团队负责人评审", description="后端代码规范和质量检查", status="pending", reviewers=["赵六", "吴十"], review_time=datetime(2024, 2, 12, 10, 30, 0), comment="", comment_editable=True),
            ReviewProcess(id="RP005", review_id="REV003", title="产品评审", description="产品负责人确认测试用例是否覆盖所有需求", status="pending", reviewers=["张三"], review_time=datetime(2024, 3, 12, 10, 0, 0), comment="", comment_editable=True),
            ReviewProcess(id="RP006", review_id="REV003", title="开发人员评审", description="开发负责人确认测试用例的技术可行性", status="pending", reviewers=["李四", "赵六"], review_time=datetime(2024, 3, 14, 14, 0, 0), comment="", comment_editable=True),
            ReviewProcess(id="RP007", review_id="REV004", title="项目经理评审", description="项目经理确认项目整体状态和发布准备情况", status="pending", reviewers=["王五"], review_time=datetime(2024, 3, 16, 10, 0, 0), comment="", comment_editable=True),
            ReviewProcess(id="RP008", review_id="REV004", title="技术负责人评审", description="技术负责人确认技术架构和代码质量符合要求", status="pending", reviewers=["李四"], review_time=datetime(2024, 3, 18, 14, 0, 0), comment="", comment_editable=True),
            ReviewProcess(id="RP009", review_id="REV004", title="运维负责人评审", description="运维负责人确认部署方案和监控策略", status="pending", reviewers=["孙八"], review_time=datetime(2024, 3, 20, 10, 0, 0), comment="", comment_editable=True),
        ]
        for rp in review_processes:
            session.add(rp)

        # TestCases
        test_cases = [
            TestCase(id="TC001", project_id="PRJ001", application_id="APP001", name="用户登录功能验证", creator="钱七", status="通过", create_time=datetime(2024, 2, 10, 10, 15, 30)),
            TestCase(id="TC002", project_id="PRJ001", application_id="APP001", name="用户信息修改测试", creator="钱七", status="失败", create_time=datetime(2024, 2, 10, 10, 20, 15)),
            TestCase(id="TC003", project_id="PRJ001", application_id="APP002", name="角色权限分配测试", creator="孙八", status="未开始", create_time=datetime(2024, 2, 10, 11, 30, 45)),
            TestCase(id="TC004", project_id="PRJ001", application_id="APP003", name="数据报表生成测试", creator="周九", status="通过", create_time=datetime(2024, 2, 10, 14, 20, 10)),
            TestCase(id="TC005", project_id="PRJ001", application_id="APP001", name="性能压力测试", creator="吴十", status="失败", create_time=datetime(2024, 2, 11, 9, 10, 22)),
        ]
        for tc in test_cases:
            session.add(tc)

        # Risks
        risks = [
            Risk(id="RSK001", project_id="PRJ001", risk_type="代码质量风险", risk_item="是否有未解决的Bug", risk_status="no"),
            Risk(id="RSK002", project_id="PRJ001", risk_type="代码质量风险", risk_item="新功能是否影响原有功能", risk_status="no"),
            Risk(id="RSK003", project_id="PRJ001", risk_type="基础设施与依赖风险", risk_item="是否接入第三方服务", risk_status="yes"),
            Risk(id="RSK004", project_id="PRJ001", risk_type="数据风险", risk_item="是否涉及数据库迁移", risk_status="no"),
            Risk(id="RSK005", project_id="PRJ001", risk_type="数据风险", risk_item="新老版本数据是否能兼容", risk_status="no"),
            Risk(id="RSK006", project_id="PRJ001", risk_type="业务风险", risk_item="产品或系统业务方面是否涉及关键业务点风险", risk_status="no"),
            Risk(id="RSK007", project_id="PRJ001", risk_type="业务风险", risk_item="是否涉及灰度方案设计", risk_status="yes"),
        ]
        for r in risks:
            session.add(r)

        session.commit()
        print("Seed completed successfully!")

    except Exception as e:
        session.rollback()
        print(f"Seed failed: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed()
